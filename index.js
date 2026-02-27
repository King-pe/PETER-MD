const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');
const path = require('path');
const express = require('express');
const QRCode = require('qrcode');
const { connectDB, getSetting } = require('./database/db');
const { handleCommand } = require('./lib/handlers');
const Config = require('./config');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '.';
const ownerNumber = process.env.OWNER_NUMBER || '255682211773';

// Variable to store the latest QR code
let lastQr = null;
let pairingCodeRequested = false;
let connectionAttempts = 0;

// Memory store to keep track of status messages seen
const statusSeen = new Set();

// Function to clean up sessions folder
function cleanupSessions() {
    const sessionsDir = path.join(process.cwd(), 'sessions');
    if (fs.existsSync(sessionsDir)) {
        try {
            const files = fs.readdirSync(sessionsDir);
            files.forEach(file => {
                const filePath = path.join(sessionsDir, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    fs.rmSync(filePath, { recursive: true, force: true });
                } else {
                    fs.unlinkSync(filePath);
                }
            });
            console.log('✅ Sessions folder cleaned up');
        } catch (err) {
            console.error('Error cleaning sessions:', err);
        }
    }
}

// Function to clear old credentials if login fails
function resetAuthState() {
    const sessionsDir = path.join(process.cwd(), 'sessions');
    if (fs.existsSync(sessionsDir)) {
        try {
            fs.rmSync(sessionsDir, { recursive: true, force: true });
            console.log('🔄 Auth state reset - sessions cleared');
        } catch (err) {
            console.error('Error resetting auth state:', err);
        }
    }
}

async function startBot() {
    try {
        await connectDB(Config.MONGODB_URI);
    } catch (err) {
        console.error('Database connection error:', err);
        setTimeout(() => startBot(), 5000);
        return;
    }

    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    let { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: P({ level: 'silent' }),
        browser: ["Windows", "Chrome", "120.0.0"],
        getMessage: async (key) => { return { conversation: 'Peter-MD' } },
        syncFullHistory: false,
        markOnlineThreshold: 0,
        retryRequestDelayMs: 10,
        fireInitQueries: false,
        emitOwnEvents: false,
        defaultQueryTimeoutMs: 0,
        maxMsToWaitForConnection: 30000,
        keepAliveIntervalMs: 30000,
        generateHighQualityLinkPreview: false,
        shouldIgnoreJid: (jid) => false,
        fetchMessagesFromWA: true,
        linkPreviewImageThumbnailWidth: 0
    });

    let connectionErrorCount = 0;

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, isNewLogin } = update;
        
        console.log(`📡 Connection Update: ${connection}`);

        // Request pairing code if PAIRING_NUMBER is set
        if (process.env.PAIRING_NUMBER && !pairingCodeRequested && (connection === 'connecting' || qr)) {
            pairingCodeRequested = true;
            setTimeout(async () => {
                try {
                    const phoneNumber = process.env.PAIRING_NUMBER.replace(/[^0-9]/g, '');
                    console.log(`📱 Requesting pairing code for: ${phoneNumber}`);
                    const code = await sock.requestPairingCode(phoneNumber);
                    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(`✅ Pairing Code: ${formattedCode}`);
                    lastQr = `CODE:${formattedCode}`;
                    connectionErrorCount = 0;
                } catch (err) {
                    console.error('❌ Error requesting pairing code:', err.message);
                    pairingCodeRequested = false;
                }
            }, 500);
        }

        // Handle QR code (fallback if pairing code not used)
        if (qr && !process.env.PAIRING_NUMBER) {
            lastQr = qr;
            console.log('📲 New QR Code generated. Visit /qr to scan.');
        }

        // Handle connection close/error
        if (connection === 'close') {
            connectionErrorCount++;
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut 
                : true;

            console.log(`Connection closed. Error count: ${connectionErrorCount}`);

            // If login failed multiple times, reset auth state
            if (connectionErrorCount > 2) {
                console.log('⚠️ Multiple connection failures detected. Resetting auth state...');
                resetAuthState();
                connectionErrorCount = 0;
            }

            pairingCodeRequested = false;

            if (shouldReconnect) {
                console.log('🔄 Attempting to reconnect in 3 seconds...');
                setTimeout(() => startBot(), 3000);
            } else {
                console.log('❌ Logged out. Please restart the bot.');
            }
        } else if (connection === 'open') {
            lastQr = null;
            pairingCodeRequested = false;
            connectionErrorCount = 0;
            console.log('✅ Bot is online!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Handle auth failure
    sock.ev.on('auth-error', (err) => {
        console.error('🔐 Auth Error:', err);
        connectionErrorCount++;
        if (connectionErrorCount > 1) {
            console.log('Resetting auth due to auth error...');
            resetAuthState();
        }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            
            const from = m.key.remoteJid;
            const isStatus = from === 'status@broadcast';
            const isBot = m.key.fromMe;
            
            // 1. STATUS SYSTEM
            if (isStatus) {
                const globalSetting = await getSetting('global');
                
                // Auto View Status
                if (globalSetting.statusview) {
                    await sock.readMessages([m.key]);
                    console.log(`Viewed status from: ${m.key.participant}`);
                }
                
                // Auto Comment Status
                if (globalSetting.statuscomment && !statusSeen.has(m.key.id)) {
                    statusSeen.add(m.key.id);
                    setTimeout(async () => {
                        await sock.sendMessage(m.key.participant, { text: globalSetting.statusreply }, { quoted: m });
                        console.log(`Commented on status from: ${m.key.participant}`);
                    }, 4000);
                }
                return;
            }

            // 2. AUTO REACT SYSTEM
            if (!isBot && !isStatus) {
                const setting = await getSetting(from);
                if (setting.react) {
                    await sock.sendMessage(from, {
                        react: { text: '❤️', key: m.key }
                    });
                }
            }

            // 3. COMMAND SYSTEM
            const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || '';
            if (body.startsWith(prefix) && !isBot) {
                await handleCommand(sock, m, body, prefix);
            }

        } catch (err) {
            console.error('Error in messages.upsert:', err);
        }
    });

    // Web endpoint for Render
    app.get('/', (req, res) => res.send('Peter-MD Bot is Running! Visit /qr to scan QR code or check pairing code.'));
    
    app.get('/qr', async (req, res) => {
        if (!lastQr) {
            return res.send(`
                <html>
                    <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f0f2f5;">
                        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
                            <h1 style="color: #075e54;">Peter-MD Bot</h1>
                            <p style="color: #555;">Bot is already connected or authentication is being generated. Please wait...</p>
                            <p style="color: #888;">Refresh this page in 5 seconds.</p>
                            <script>setTimeout(() => { location.reload(); }, 5000);</script>
                        </div>
                    </body>
                </html>
            `);
        }
        
        if (lastQr.startsWith('CODE:')) {
            const code = lastQr.split(':')[1];
            return res.send(`
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Peter-MD Pairing Code</title>
                    </head>
                    <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0;">
                        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px;">
                            <h1 style="color: #075e54; margin-top: 0;">🔗 Peter-MD Pairing Code</h1>
                            <p style="font-size: 1.1rem; color: #555; margin: 20px 0;">Ingiza kodi hii kwenye simu yako:</p>
                            <div style="font-size: 2.5rem; font-weight: bold; letter-spacing: 8px; margin: 30px 0; color: #fff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; font-family: 'Courier New', monospace;">
                                ${code}
                            </div>
                            <div style="background: #f0f2f5; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                                <p style="color: #333; margin: 10px 0;"><strong>📱 Hatua za Kuunganisha:</strong></p>
                                <ol style="color: #555; text-align: left;">
                                    <li>Fungua WhatsApp kwenye simu yako</li>
                                    <li>Nenda kwenye <strong>Linked Devices</strong></li>
                                    <li>Chagua <strong>Link with phone number instead</strong></li>
                                    <li>Ingiza kodi hii: <strong>${code}</strong></li>
                                    <li>Kama inaandika "Couldn't login", jaribu tena au refresh page hii</li>
                                </ol>
                            </div>
                            <p style="color: #888; font-size: 0.9rem; margin-top: 20px;">Kodi hii itakataa baada ya dakika 1. Refresh kama inakataa.</p>
                            <script>
                                setTimeout(() => { location.reload(); }, 60000);
                                setInterval(() => { location.reload(); }, 30000);
                            </script>
                        </div>
                    </body>
                </html>
            `);
        }

        try {
            const qrImage = await QRCode.toDataURL(lastQr);
            res.send(`
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Peter-MD QR Code</title>
                    </head>
                    <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0;">
                        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center;">
                            <h1 style="color: #075e54; margin-top: 0;">📲 Scan QR Code</h1>
                            <img src="${qrImage}" style="width: 300px; height: 300px; border: 10px solid #eee; margin: 20px 0; border-radius: 10px;" />
                            <p style="color: #555; margin: 15px 0;">Scan this QR code with your WhatsApp to connect Peter-MD.</p>
                            <p style="color: #888; font-size: 0.9rem;">QR code will expire in 60 seconds. Refresh if it doesn't work.</p>
                            <script>setTimeout(() => { location.reload(); }, 60000);</script>
                        </div>
                    </body>
                </html>
            `);
        } catch (err) {
            res.status(500).send('Error generating QR code image.');
        }
    });

    app.listen(port, () => console.log(`Server started on port ${port}`));
}

startBot();
