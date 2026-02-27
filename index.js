require('dotenv').config();
const express = require('express');
const { default: makeWASocket, DisconnectReason } = require('@whiskeysockets/baileys');
const { initAuthCreds, BufferJSON } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const SESSION_FILE = process.env.SESSION_FILE || 'session.json';

// Simple file-based auth state
const getAuthState = () => {
	if (fs.existsSync(SESSION_FILE)) {
		return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'), BufferJSON.reviver);
	}
	const creds = initAuthCreds();
	return { creds, keys: {} };
};

const saveAuthState = (state) => {
	fs.writeFileSync(SESSION_FILE, JSON.stringify(state, BufferJSON.replacer, 2));
};

let client;
let currentQr = null;

async function start() {
	const authState = getAuthState();
	
	client = makeWASocket({
		auth: authState,
		printQRInTerminal: true,
	});

	client.ev.on('connection.update', update => {
		const { connection, qr, lastDisconnect } = update;

		if (qr) {
			currentQr = qr;
		}

		if (connection === 'open') {
			currentQr = null;
			console.log('WhatsApp connection established');
		}

		if (connection === 'close') {
			const reason = lastDisconnect?.error?.output?.statusCode;
			console.log('connection closed', reason);

			if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.restartRequired) {
				try { fs.unlinkSync(SESSION_FILE); } catch (e) {}
				console.log('session file removed, restart to generate new QR');
			}
		}
	});

	client.ev.on('creds.update', () => {
		saveAuthState(authState);
	});
}

start();

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
