require('dotenv').config();
const express = require('express');
const { default: makeWASocket,
		DisconnectReason,
		useMultiFileAuthState,
		Browsers } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const pino = require('pino');
const { handleCommand } = require('./handlers');
const { getSetting } = require('./database/db');

// where baileys will keep its multi-file auth state directory
const SESSION_PATH = path.join(process.cwd(), 'auth_info_baileys');

// GLOBAL variables - accessible to all functions and endpoints
let client = null;
let currentQr = null;
let isConnected = false;
let connectionStatus = 'starting';
let lastError = '';

async function start() {
	currentQr = null; // Reset QR on start
	connectionStatus = 'starting';
	lastError = '';
	console.log('starting WhatsApp client, session path:', SESSION_PATH);
	try {
		const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

		client = makeWASocket({
			logger: pino({ level: 'silent' }),
			auth: state,
			printQRInTerminal: true,
			browser: ["Ubuntu", "Chrome", "20.0.04"],
			syncFullHistory: false,
			keepAliveIntervalMs: 30000, // Husaidia connection isipotee hovyo
			connectTimeoutMs: 60000,
		});

		client.ev.on('connection.update', update => {
		// log the full update for debugging environments where no events arrive
		// console.log('connection.update', JSON.stringify(update)); // Commented out to reduce log spam
		const { connection, qr, lastDisconnect } = update;

			if (connection) connectionStatus = connection;
			if (qr) {
				currentQr = qr;
				console.log('📱 New QR Code generated');
			}

			if (connection === 'open') {
				currentQr = null;
				isConnected = true;
				console.log('✅ WhatsApp connection established');
			}

			if (connection === 'close') {
				isConnected = false;
				const reason = lastDisconnect?.error?.output?.statusCode;
				console.log('❌ Connection closed:', reason);
				lastError = `Connection closed: ${reason || 'Unknown'}`;

				if (reason === DisconnectReason.loggedOut || reason === 405 || reason === 403 || reason === 401) {
					console.log('⚠️ Session invalid (Logged out/405/403). Deleting session and waiting 15s...');
					try { fs.rmSync(SESSION_PATH, { recursive: true, force: true }); } catch (e) {}
					
					// Subiri sekunde 15 kabla ya kuanza tena ili kuzuia ban ya Render
					setTimeout(() => start().catch(console.error), 15000);
				} else {
					console.log('🔄 Connection closed, reconnecting in 5s...');
					setTimeout(() => start().catch(console.error), 5000);
				}
			}
		});

		client.ev.on('creds.update', saveCreds);

		// Listen for new messages
		client.ev.on('messages.upsert', async chatUpdate => {
			try {
				const m = chatUpdate.messages[0];
				if (!m.message || m.key.fromMe) return;

				// Handle Status Updates (Auto View & Auto Reply)
				if (m.key.remoteJid === 'status@broadcast') {
					const settings = await getSetting('global');
					if (settings.statusview) {
						await client.readMessages([m.key]);
					}
					if (settings.statuscomment) {
						await client.sendMessage(m.key.participant, { 
							text: settings.statusreply || '👋' 
						}, { quoted: m });
					}
					return;
				}

				const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
				if (body.startsWith('.')) {
					await handleCommand(client, m, body, '.');
				} else if (!m.key.remoteJid.endsWith('@g.us') && !m.key.remoteJid.includes('status@broadcast')) {
					// Auto Reply for Inbox (PM) - Hii itajibu inbox tu
					await client.sendMessage(m.key.remoteJid, { 
						text: '🤖 *Auto Reply*\n\nAsante kwa ujumbe wako! Hii ni bot. Tafadhali tumia commands au subiri mwenye namba aje.' 
					}, { quoted: m });
				}
			} catch (err) {
				console.error('Error handling message:', err);
			}
		});

		// Listen for group participants update (Goodbye Message)
		client.ev.on('group-participants.update', async (update) => {
			try {
				const { id, participants, action } = update;
				
				if (action === 'add' || action === 'remove') {
					let groupName = 'Group';
					let memberCount = '0';
					try {
						const metadata = await client.groupMetadata(id);
						groupName = metadata.subject;
						memberCount = metadata.participants.length;
					} catch (e) {}

					for (const participant of participants) {
						let ppUrl;
						try {
							ppUrl = await client.profilePictureUrl(participant, 'image');
						} catch {
							ppUrl = 'https://i.imgur.com/HeIi0w0.png'; // Picha ya default kama hana DP
						}

						const userName = participant.split('@')[0];
						let messageContent = {};

						if (action === 'add') {
							// Welcome Card API - Inatengeneza picha yenye jina
							const welcomeUrl = `https://api.popcat.xyz/welcomecard?background=https://telegra.ph/file/e29742004966086e3ec2a.jpg&text1=${encodeURIComponent(userName)}&text2=Welcome+to+${encodeURIComponent(groupName)}&text3=Member+${memberCount}&avatar=${encodeURIComponent(ppUrl)}`;
							messageContent = { image: { url: welcomeUrl }, caption: `Karibu @${userName} kwenye *${groupName}*! 🥳\n\nTunafurahi kukuona.`, mentions: [participant] };
						} else {
							messageContent = { image: { url: ppUrl }, caption: `Kwaheri @${userName} 👋. Tutaonana baadaye!`, mentions: [participant] };
						}

						await client.sendMessage(id, messageContent);
					}
				}
			} catch (err) {
				console.error('Error in group-participants.update:', err);
			}
		});
	} catch (err) {
		console.error('error during start():', err);
		throw err;
	}
}

// kick off the WhatsApp socket when the process starts
start().catch(err => {
	console.error('failed to start WhatsApp client', err);
});

const app = express();

app.get('/qr', async (req, res) => {
	res.setHeader('Content-Type', 'text/html');

	if (currentQr) {
		try {
			const url = await qrcode.toDataURL(currentQr);
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
                <img src="${url}" alt="QR Code"/>
                <div class="status">
                    <p>⏱️ Refresh every 60 seconds</p>
                    <p id="timer">Refreshing...</p>
                </div>
                <div class="code">${currentQr}</div>
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
			`);
			return;
		} catch (err) {
			// Fallback if image generation fails
		}
	}

	if (isConnected || (client && client.user)) {
		return res.send(`
			<html>
				<head><title>Peter-MD Connected</title></head>
				<body style="font-family:sans-serif;text-align:center;padding:50px;">
					<h1>✅ Bot is Connected</h1>
					<p>Peter-MD is active and running.</p>
					<a href="/logout" style="color:red;">Logout</a>
				</body>
			</html>
		`);
	}

	res.send(`
		<html>
			<head>
				<title>Peter-MD Status</title>
				<meta http-equiv="refresh" content="5">
				<style>body{font-family:sans-serif;text-align:center;padding:50px;}</style>
			</head>
			<body>
				<h2>QR Code Loading...</h2>
				<p>Current Status: <b>${connectionStatus}</b></p>
				${lastError ? `<p style="color:red;">Last Error: ${lastError}</p>` : ''}
				${lastError.includes('405') ? '<p style="color:orange;font-weight:bold;">⚠️ 405 Error: Please click "Reset Session" below to fix.</p>' : ''}
				<p>Please wait, page reloads every 5 seconds. (Bot is restarting if status is 'close')</p>
				<br>
				<p>If it's stuck on "connecting" for long:</p>
				<a href="/reset" style="background:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Session</a>
			</body>
		</html>
	`);
});

app.get('/', (req, res) => {
	if (isConnected) {
		res.send('Peter-MD Bot is active ✅');
	} else {
		res.redirect('/qr');
	}
});

app.get('/logout', (req, res) => {
	if (!client) return res.send('Not started yet');
	client.logout();
	currentQr = null;
	res.send('logged out; restart process to obtain fresh QR');
});

app.get('/reset', (req, res) => {
	res.send('Resetting session... Bot is restarting. Check /qr in 30 seconds.');
	try {
		if (client) client.end(undefined);
		fs.rmSync(SESSION_PATH, { recursive: true, force: true });
	} catch (e) {}
	setTimeout(() => process.exit(0), 1000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🌐 Server Running on Port ' + PORT);
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    console.log(`📱 Access QR: ${baseUrl}/qr`);
    console.log(`🔗 WhatsApp Link: ${baseUrl}/whatsapp-link`);
    console.log(`📊 Status: ${baseUrl}/status`);

	// Auto-ping to keep Render awake
	const pingUrl = process.env.RENDER_EXTERNAL_URL || 'https://peter-md-8wpz.onrender.com';
	setInterval(() => {
		fetch(pingUrl).then(() => console.log('✅ Keep-alive ping')).catch(() => {});
	}, 5 * 60 * 1000); // Ping every 5 minutes to prevent sleep
});
