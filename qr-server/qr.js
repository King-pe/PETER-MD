/**
 * QR Code Server
 * Generates QR codes for WhatsApp pairing and automatically sends creds.json to user
 */

const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const pino = require('pino');
const SessionManager = require('../lib/sessionManager');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys');

let router = express.Router();

// Initialize session manager
const sessionManager = new SessionManager(path.join(__dirname, '..', 'session'));

// Temporary storage for active QR sessions
const activeSessions = new Map();

/**
 * Remove temporary files
 */
function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    try {
        fs.rmSync(filePath, { recursive: true, force: true });
        return true;
    } catch (error) {
        console.error('Error removing file:', error.message);
        return false;
    }
}

/**
 * Welcome message sent to user after successful connection
 */
const WELCOME_MESSAGE = `
╔════◇════════════════════════════════╗
║  🎉 *KARIBU PETER-MD* 🎉            ║
║                                      ║
║ _Umefaulu kuscan QR code!_           ║
║ _Sasa unaweza kuanza kutumia bot._   ║
║                                      ║
║ 📋 *Hatua Inayofuata:*               ║
║ 1. Nusuru SESSION_ID kutoka ujumbe   ║
║    ujao                              ║
║ 2. Weka SESSION_ID kwenye            ║
║    environment variable              ║
║ 3. Restart bot                       ║
║ 4. Jifunze kuhusu amri za bot        ║
║                                      ║
║ ⚠️  *MUHIMU:*                        ║
║ • Usishare SESSION_ID yako!          ║
║ • Kila mtu anayemiliki SESSION_ID    ║
║   anaweza kufikia ujumbe wako wote   ║
║ • Usiweke kwenye GitHub au mahali    ║
║   ya umma                            ║
║                                      ║
║ 📞 *Msaada:*                         ║
║ Owner: https://wa.me/255682211773    ║
║ GitHub: github.com/King-pe/PETER-MD ║
║                                      ║
╚════◇════════════════════════════════╝
`;

/**
 * Session ID header message
 */
const SESSION_ID_HEADER = `
╔════◇════════════════════════════════╗
║  🔐 *SESSION_ID YAKO* 🔐             ║
║                                      ║
║ _Hii ni SESSION_ID yako ya kipekee._ ║
║ _Tumia kwenye bot configuration._    ║
║                                      ║
║ ⚠️  *ONYO LA USALAMA:*               ║
║ • Usishare SESSION_ID hii!           ║
║ • Usiweke kwenye GitHub au mahali    ║
║   ya umma                            ║
║ • Kila mtu anayemiliki hii anaweza   ║
║   kufikia chats yako yote            ║
║                                      ║
║ 📌 *Jinsi ya Kutumia:*               ║
║ 1. Nakili SESSION_ID hii              ║
║ 2. Kwenda kwenye Render/hosting       ║
║ 3. Weka kwenye environment variables: ║
║    SESSION_ID = [paste here]         ║
║ 4. Restart bot                       ║
║ 5. Bot itakuwa ready!                ║
║                                      ║
║ 💡 *Tip:*                            ║
║ Unaweza kusave SESSION_ID kwenye     ║
║ faili salama au password manager     ║
║                                      ║
╚════◇════════════════════════════════╝

🔑 *SESSION_ID YAKO:*

`;

/**
 * Main QR endpoint
 */
router.get('/', async (req, res) => {
    const sessionId = makeid();
    const tempDir = path.join(__dirname, 'temp', sessionId);
    
    console.log(`\n📱 New QR session started: ${sessionId}`);
    console.log(`📂 Temp directory: ${tempDir}`);

    async function startQR() {
        try {
            // Create temp directory
            await fs.ensureDir(tempDir);

            // Get auth state
            const { state, saveCreds } = await useMultiFileAuthState(tempDir);
            const { version } = await fetchLatestBaileysVersion();

            // Create socket
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: Browsers.macOS('Desktop'),
                version,
                shouldSyncHistoryMessage: true,
                downloadHistory: true,
                syncFullHistory: true,
                generateHighQualityLinkPreview: true,
                markOnlineOnConnect: false
            });

            // Store session info
            activeSessions.set(sessionId, {
                socket: sock,
                createdAt: new Date(),
                userJid: null
            });

            // Handle credentials update
            sock.ev.on('creds.update', saveCreds);

            // Handle connection updates
            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                // Send QR code
                if (qr) {
                    console.log(`📱 QR code generated for session: ${sessionId}`);
                    if (!res.headersSent) {
                        try {
                            const qrBuffer = await QRCode.toBuffer(qr);
                            res.setHeader('Content-Type', 'image/png');
                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                            res.end(qrBuffer);
                        } catch (error) {
                            console.error('❌ QR generation error:', error.message);
                            if (!res.headersSent) {
                                res.status(500).send('Error generating QR code');
                            }
                        }
                    }
                }

                // Connection opened - send session ID
                if (connection === 'open') {
                    console.log(`✅ Device linked: ${sock.user.id}`);
                    
                    const userJid = sock.user.id;
                    const sessionInfo = activeSessions.get(sessionId);
                    if (sessionInfo) {
                        sessionInfo.userJid = userJid;
                    }

                    try {
                        // Wait a bit for creds to be saved
                        await delay(2000);

                        // Read creds.json
                        const credsFile = path.join(tempDir, 'creds.json');
                        if (!fs.existsSync(credsFile)) {
                            throw new Error('creds.json not found');
                        }

                        // Encode to SESSION_ID
                        const encodedSessionId = await sessionManager.encodeSession(credsFile);

                        console.log(`📤 Sending SESSION_ID to user: ${userJid}`);

                        // Send welcome message
                        await sock.sendMessage(userJid, { 
                            text: WELCOME_MESSAGE 
                        });

                        await delay(1500);

                        // Send SESSION_ID
                        await sock.sendMessage(userJid, { 
                            text: SESSION_ID_HEADER + '```' + encodedSessionId + '```'
                        });

                        console.log(`✅ SESSION_ID sent to user successfully`);

                        // Also save to session directory for immediate use
                        const permanentCredsPath = path.join(__dirname, '..', 'session', 'creds.json');
                        await fs.copy(credsFile, permanentCredsPath);
                        console.log(`💾 Credentials saved to: ${permanentCredsPath}`);

                        // Wait before closing
                        await delay(3000);

                    } catch (error) {
                        console.error('❌ Error sending SESSION_ID:', error.message);
                        try {
                            await sock.sendMessage(userJid, {
                                text: `❌ Error: ${error.message}\n\nPlease try again.`
                            });
                        } catch (e) {
                            console.error('Could not send error message');
                        }
                    }

                    // Close connection
                    try {
                        await delay(2000);
                        sock.ws.close();
                        console.log(`🔌 Connection closed for session: ${sessionId}`);
                    } catch (error) {
                        console.error('Error closing connection:', error.message);
                    }
                }

                // Connection closed
                if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`🔌 Connection closed. Reason code: ${reason}`);

                    if (reason !== DisconnectReason.loggedOut && reason !== 401) {
                        // Might be temporary, could retry
                    } else {
                        // Logged out or unauthorized
                        console.log('❌ Logged out or unauthorized');
                    }
                }
            });

        } catch (error) {
            console.error('❌ QR Server Error:', error.message);
            console.error('Stack:', error.stack);
            
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Failed to generate QR code',
                    message: error.message
                });
            }
        } finally {
            // Cleanup
            setTimeout(() => {
                try {
                    removeFile(tempDir);
                    activeSessions.delete(sessionId);
                    console.log(`🧹 Cleaned up session: ${sessionId}`);
                } catch (error) {
                    console.error('Error during cleanup:', error.message);
                }
            }, 30000); // Cleanup after 30 seconds
        }
    }

    startQR();
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        activeSessions: activeSessions.size,
        timestamp: new Date().toISOString()
    });
});

/**
 * Session status endpoint
 */
router.get('/status', (req, res) => {
    const sessions = Array.from(activeSessions.entries()).map(([id, info]) => ({
        id,
        createdAt: info.createdAt,
        userJid: info.userJid,
        age: Date.now() - info.createdAt.getTime()
    }));

    res.json({
        activeSessions: sessions.length,
        sessions,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
