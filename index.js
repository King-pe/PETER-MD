require('dotenv').config();
const express = require('express');
const { default: makeWASocket,
        DisconnectReason,
        useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const SESSION_PATH = path.join(process.cwd(), 'auth_info_baileys');

// GLOBAL variables - accessible to all functions
let client = null;
let currentQr = null;
let isConnected = false;

async function start() {
	const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

	client = makeWASocket({
		auth: state,
		printQRInTerminal: true
	});

	client.ev.on('connection.update', update => {
		const { connection, qr, lastDisconnect } = update;

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

			if (reason === DisconnectReason.loggedOut) {
				console.log('🔄 Logged out, deleting session');
				try { 
					fs.rmSync(SESSION_PATH, { recursive: true, force: true }); 
				} catch (e) {}
			}
		}
	});

	client.ev.on('creds.update', saveCreds);

	// ...existing code...
}

const app = express();

app.get('/qr', (req, res) => {
	if (!client) {
		return res.status(503).json({ error: 'Bot still initializing...' });
	}

	if (currentQr) {
		return res.json({ qr: currentQr });
	}

	if (isConnected) {
		return res.json({
			error: 'Bot already connected – call /logout to get a new QR'
		});
	}

	res.json({ error: 'No QR Available - Bot may be connected or starting' });
});

app.get('/logout', (req, res) => {
	if (!client) return res.status(400).send('Bot not started yet');
	client.logout();
	currentQr = null;
	isConnected = false;
	res.send('logged out; restart to get fresh QR');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('listening on port ' + (process.env.PORT || 3000));
});
