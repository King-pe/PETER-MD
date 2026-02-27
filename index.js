require('dotenv').config();
const express = require('express');
const { default: makeWASocket,
		DisconnectReason,
		useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// where baileys will keep its multi-file auth state directory
const SESSION_PATH = path.join(process.cwd(), 'auth_info_baileys');

// GLOBAL variables - accessible to all functions and endpoints
let client = null;
let currentQr = null;
let isConnected = false;

async function start() {
	console.log('starting WhatsApp client, session path:', SESSION_PATH);
	try {
		const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

		client = makeWASocket({
			auth: state,
			printQRInTerminal: true,
		});

		client.ev.on('connection.update', update => {
		// log the full update for debugging environments where no events arrive
		console.log('connection.update', JSON.stringify(update));
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
					console.log('🔄 Logged out, deleting session files');
					try { fs.rmSync(SESSION_PATH, { recursive: true, force: true }); } catch (e) {}
				}
			}
		});

		client.ev.on('creds.update', saveCreds);
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

app.get('/qr', (req, res) => {
	if (currentQr) {
		return res.json({ qr: currentQr });
	}

	if (client && client.user) {
		return res.json({
			error: 'Bot already connected – delete session or call /logout to get a new QR'
		});
	}

	res.json({ error: 'No QR Available - Bot may be connected or starting' });
});

app.get('/logout', (req, res) => {
	if (!client) return res.send('Not started yet');
	client.logout();
	currentQr = null;
	res.send('logged out; restart process to obtain fresh QR');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('http server listening');
});
