const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')

const { Boom } = require('@hapi/boom')
const P = require('pino')
const fs = require('fs')
const express = require('express')
const QRCode = require('qrcode')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
const prefix = process.env.PREFIX || '.'

let sock
let lastQr = null
let qrAttempts = 0
let botInfo = null

// ============ RESET SESSION ============
function resetSession() {
    if (fs.existsSync('./sessions')) {
        fs.rmSync('./sessions', { recursive: true, force: true })
        console.log('✅ Session Reset Complete')
    }
}

// ============ START BOT ============
async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState('./sessions')
    const { version } = await fetchLatestBaileysVersion()

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: P({ level: 'silent' }),
        browser: ['Peter-MD', 'Chrome', '1.0.0']
    })

    // ============ CONNECTION ============
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            qrAttempts++
            lastQr = qr
            console.log(`📲 QR Generated (Attempt: ${qrAttempts})`)
            console.log(`🔗 Access QR at: http://localhost:${PORT}/qr`)
        }

        if (connection === 'open') {
            console.log('✅ Bot Connected Successfully')
            qrAttempts = 0
            lastQr = null
            if (sock.user) {
                botInfo = {
                    jid: sock.user.id,
                    number: sock.user.id.split(':')[0],
                    name: sock.user.name || 'Peter-MD'
                }
                console.log(`🤖 Bot Name: ${botInfo.name}`)
            }
        }

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

            if (reason === DisconnectReason.loggedOut) {
                console.log('❌ Logged Out — Resetting Session')
                resetSession()
                startBot()
            } else {
                console.log('🔄 Reconnecting...')
                startBot()
            }
        }
    })

    sock.ev.on('creds.update', saveCreds)

    // ============ MESSAGE HANDLER ============
    sock.ev.on('messages.upsert', async (msg) => {
        try {
            const m = msg.messages[0]
            if (!m.message || m.key.fromMe) return

            const from = m.key.remoteJid
            const body =
                m.message.conversation ||
                m.message.extendedTextMessage?.text ||
                ''

            // ===== AUTO REACT =====
            if (process.env.AUTO_REACT === 'true') {
                await sock.sendMessage(from, {
                    react: { text: '❤️', key: m.key }
                })
            }

            // ===== COMMANDS =====
            if (body.startsWith(prefix)) {
                const cmd = body.slice(1).split(' ')[0].toLowerCase()

                if (cmd === 'ping') {
                    await sock.sendMessage(from, { text: '🏓 Pong!' })
                }

                if (cmd === 'react') {
                    process.env.AUTO_REACT = 'true'
                    await sock.sendMessage(from, { text: '✅ Auto React ON' })
                }

                if (cmd === 'noreact') {
                    process.env.AUTO_REACT = 'false'
                    await sock.sendMessage(from, { text: '❌ Auto React OFF' })
                }
            }

        } catch (err) {
            console.log(err)
        }
    })
}

// ============ RENDER SERVER ============
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        name: 'Peter-MD WhatsApp Bot',
        bot: botInfo || 'Disconnected',
        qr: lastQr ? 'Available' : 'Not Available',
        endpoints: {
            qr: '/qr',
            status: '/status',
            whatsapp_link: '/whatsapp-link'
        }
    })
})

// QR Code Display
app.get('/qr', async (req, res) => {
    if (!lastQr) return res.json({ error: 'No QR Available - Bot may be connected or starting' })

    const qrImage = await QRCode.toDataURL(lastQr)

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Peter-MD QR Code</title>
            <style>
                body { font-family: Arial; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f0f0f0; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                h1 { color: #333; margin-bottom: 20px; }
                img { width: 300px; height: 300px; margin: 20px 0; }
                .status { color: #666; font-size: 14px; margin-top: 10px; }
                .code { background: #f9f9f9; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; word-break: break-all; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📱 Peter-MD WhatsApp Bot</h1>
                <h2>Scan QR Code to Connect</h2>
                <img src="${qrImage}" alt="QR Code"/>
                <div class="status">
                    <p>⏱️ Refresh every 60 seconds</p>
                    <p id="timer">Refreshing...</p>
                </div>
                <div class="code">${lastQr}</div>
            </div>
            <script>
                let countdown = 60;
                setInterval(() => {
                    countdown--;
                    document.getElementById('timer').textContent = 'Refreshing in ' + countdown + 's';
                    if (countdown <= 0) location.reload();
                }, 1000);
            </script>
        </body>
        </html>
    `)
})

// WhatsApp Link Generator
app.get('/whatsapp-link', (req, res) => {
    const phoneNumber = req.query.phone || (botInfo ? botInfo.number : '');
    const message = req.query.message || 'Habari!';
    
    if (!phoneNumber) {
        return res.json({
            error: 'Phone number required',
            usage: '/whatsapp-link?phone=255XXXXXXXXX&message=Your+message'
        });
    }

    // Format WhatsApp link
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WhatsApp Link</title>
            <style>
                body { font-family: Arial; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f0f0f0; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; }
                a { display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
                a:hover { background: #20BA5B; }
                .code { background: #f9f9f9; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; word-break: break-all; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>📲 Open WhatsApp</h2>
                <p>Phone: <strong>${phoneNumber}</strong></p>
                <p>Message: <strong>${message}</strong></p>
                <a href="${whatsappLink}" target="_blank">💬 Open WhatsApp Chat</a>
                <div class="code">${whatsappLink}</div>
            </div>
        </body>
        </html>
    `)
})

// Bot Status Endpoint
app.get('/status', (req, res) => {
    res.json({
        connected: !!botInfo,
        botInfo: botInfo || null,
        qrAvailable: !!lastQr,
        qrAttempts: qrAttempts,
        uptime: process.uptime()
    })
})

app.listen(PORT, () => {
    console.log('🌐 Server Running on Port ' + PORT)
    console.log(`📱 Access QR: http://localhost:${PORT}/qr`)
    console.log(`🔗 WhatsApp Link: http://localhost:${PORT}/whatsapp-link`)
    console.log(`📊 Status: http://localhost:${PORT}/status`)
})

startBot()
