require('dotenv').config();
const express = require('express');
const { default: makeWASocket,
		DisconnectReason,
		useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

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
			browser: ["Peter-MD", "Chrome", "1.0.0"], // Fixes 405 error
			connectTimeoutMs: 60000,
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

app.get('/qr', async (req, res) => {
	if (currentQr) {
		try {
			const url = await qrcode.toDataURL(currentQr);
			return res.send(`
				<!DOCTYPE html>
				<html>
				<head>
					<title>Peter-MD QR Scan</title>
					<meta http-equiv="refresh" content="10">
					<style>body{display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f2f5;font-family:sans-serif;} .card{background:white;padding:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);text-align:center;}</style>
				</head>
				<body>
					<div class="card">
						<h2>Scan QR Code</h2>
						<img src="${url}" alt="QR Code" />
						<p>Reloads every 10 seconds</p>
					</div>
				</body>
				</html>
			`);
		} catch (err) {
			return res.status(500).send('Error generating QR image');
		}
	}

	if (client && client.user) {
		return res.json({
			error: 'Bot already connected – delete session or call /logout to get a new QR'
		});
	}

	res.json({ error: 'No QR Available - Bot may be connected or starting' });
});

app.get('/', (req, res) => {
	res.send('Peter-MD Bot is active ✅');
});

app.get('/logout', (req, res) => {
	if (!client) return res.send('Not started yet');
	client.logout();
	currentQr = null;
	res.send('logged out; restart process to obtain fresh QR');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('http server listening');

	// Auto-ping to keep Render awake
	const pingUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 3000}`;
	setInterval(() => {
		fetch(pingUrl).then(() => console.log('✅ Keep-alive ping')).catch(() => {});
	}, 10 * 60 * 1000); // Ping every 10 minutes
});
