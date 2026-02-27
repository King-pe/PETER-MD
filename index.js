require('dotenv').config();
const express = require('express');
const { default: makeWASocket,
        DisconnectReason,
        useSingleFileAuthState } = require('@adiwajshing/baileys');
const fs = require('fs');

const SESSION_FILE = process.env.SESSION_FILE || 'session.json';
const { state, saveState } = useSingleFileAuthState(SESSION_FILE);

let client;          // the wa socket
let currentQr = null; // store last QR string

async function start() {
	// …other options you already use…
	client = makeWASocket({
		auth: state,
		printQRInTerminal: true
	});

	client.ev.on('connection.update', update => {
		const { connection, qr, lastDisconnect } = update;

		if (qr) {
			// new QR received – remember it so the web endpoint can use it
			currentQr = qr;
		}

		if (connection === 'open') {
			// once open we clear the qr variable
			currentQr = null;
			console.log('WhatsApp connection established');
		}

		if (connection === 'close') {
			const reason =
				lastDisconnect?.error
					&& new Boom(lastDisconnect.error).output?.statusCode;

			console.log('connection closed', reason);

			// if we were logged out or restarted remove the session file
			if (reason === DisconnectReason.loggedOut ||
				reason === DisconnectReason.restartRequired) {
				try { fs.unlinkSync(SESSION_FILE); } catch (e) {}
				console.log('session file removed, restart to generate new QR');
			}
		}
	});

	client.ev.on('creds.update', saveState);
}

start();

// simple express API to serve/clear the QR
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

	// still starting or just lost the QR
	res.json({ error: 'No QR Available - Bot may be connected or starting' });
});

app.get('/logout', (req, res) => {
	if (!client) return res.send('Not started yet');
	client.logout();           // will trigger connection.update close event
	currentQr = null;
	res.send('logged out; restart process to obtain fresh QR');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('http server listening');
});
