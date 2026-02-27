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
            lastQr = qr
            console.log('📲 QR Generated')
        }

        if (connection === 'open') {
            console.log('✅ Bot Connected Successfully')
            lastQr = null
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
    res.send('Peter-MD Running')
})

app.get('/qr', async (req, res) => {
    if (!lastQr) return res.send('No QR Available')

    const qrImage = await QRCode.toDataURL(lastQr)

    res.send(`
        <h2>Scan QR</h2>
        <img src="${qrImage}" width="300"/>
        <script>setTimeout(()=>location.reload(),60000)</script>
    `)
})

app.listen(PORT, () => {
    console.log('🌐 Server Running on Port ' + PORT)
})

startBot()
