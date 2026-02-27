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

// Memory store to keep track of status messages seen
const statusSeen = new Set();

async function startBot() {
    await connectDB(Config.MONGODB_URI);

    const { state, saveCreds } = await useMultiFileAuthState('sessions');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: P({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        getMessage: async (key) => { return { conversation: 'Peter-MD' } }
    });

    // Pairing Code Support
    if (process.env.PAIRING_NUMBER && !sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(process.env.PAIRING_NUMBER.replace(/[^0-9]/g, ''));
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`✅ Pairing Code: ${code}`);
                lastQr = `CODE:${code}`; // Store code in lastQr with a prefix for the web UI
            } catch (err) {
                console.error('Error requesting pairing code:', err);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            lastQr = qr;
            console.log('New QR Code generated. Visit /qr to scan.');
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            lastQr = null; // Clear QR once connected
            console.log('✅ Bot is online!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

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
                    }, 4000); // 4s delay
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
    app.get('/', (req, res) => res.send('Peter-MD Bot is Running! Visit /qr to scan QR code.'));
    
    app.get('/qr', async (req, res) => {
        if (!lastQr) {
            return res.send('Bot is already connected or authentication not generated yet. Please wait or check logs.');
        }
        
        if (lastQr.startsWith('CODE:')) {
            const code = lastQr.split(':')[1];
            return res.send(`
                <html>
                    <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f0f2f5;">
                        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
                            <h1 style="color: #075e54;">Peter-MD Pairing Code</h1>
                            <p style="font-size: 1.2rem; color: #555;">Ingiza kodi hii kwenye simu yako:</p>
                            <div style="font-size: 3rem; font-weight: bold; letter-spacing: 5px; margin: 20px 0; color: #25d366; background: #e7fce3; padding: 20px; border-radius: 10px;">
                                ${code}
                            </div>
                            <p style="color: #888;">Nenda kwenye WhatsApp > Linked Devices > Link with phone number instead</p>
                            <script>setTimeout(() => { location.reload(); }, 30000);</script>
                        </div>
                    </body>
                </html>
            `);
        }

        try {
            const qrImage = await QRCode.toDataURL(lastQr);
            res.send(`
                <html>
                    <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f0f2f5;">
                        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;">
                            <h1 style="color: #075e54;">Scan QR Code to Connect Peter-MD</h1>
                            <img src="${qrImage}" style="width: 300px; height: 300px; border: 10px solid #eee; margin: 20px 0;" />
                            <p style="color: #555;">Scan this QR code with your WhatsApp.</p>
                            <p style="color: #888; font-size: 0.8rem;">QR code will expire in 60 seconds. Refresh if it doesn't work.</p>
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
