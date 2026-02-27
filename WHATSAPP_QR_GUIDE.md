# WhatsApp Bot QR Code & Link Integration Guide

## Overview
Your Peter-MD bot now includes full WhatsApp QR code and link generation capabilities. This guide explains how to use them.

## Features

### 1. QR Code Scanner
- **Endpoint:** `http://localhost:3000/qr`
- **Purpose:** Display QR code to scan and connect the bot to WhatsApp
- **Auto-refresh:** Every 60 seconds
- **Status:** Shows connection attempts

### 2. WhatsApp Link Generator
- **Endpoint:** `http://localhost:3000/whatsapp-link?phone=255XXXXXXXXX&message=YourMessage`
- **Purpose:** Generate clickable WhatsApp links
- **Parameters:**
  - `phone` (required): Phone number with country code (e.g., 255712345678)
  - `message` (optional): Pre-filled message text

### 3. Bot Status Monitor
- **Endpoint:** `http://localhost:3000/status`
- **Returns:** JSON with bot connection status and info

## Usage Examples

### Generate QR Code for Connection
```
http://localhost:3000/qr
```
This displays an HTML page with the QR code. Scan with your phone to connect the bot.

### Generate WhatsApp Link
```
http://localhost:3000/whatsapp-link?phone=255712345678&message=Habari%20nako
```
This creates a link that opens WhatsApp with a pre-filled message.

### Check Bot Status
```
http://localhost:3000/status
```
Returns JSON response with bot connection details.

## WhatsApp Manager Class

The `lib/whatsapp.js` module provides utility functions:

### Methods

#### `generateLink(phoneNumber, message)`
```javascript
const whatsapp = require('./lib/whatsapp');
const link = whatsapp.generateLink('255712345678', 'Hello!');
// Returns: https://wa.me/255712345678?text=Hello!
```

#### `formatPhoneNumber(phoneNumber)`
```javascript
whatsapp.formatPhoneNumber('0712345678');
// Returns: 255712345678 (adds Tanzania country code)
```

#### `phoneNumberToJid(phoneNumber)`
```javascript
whatsapp.phoneNumberToJid('255712345678');
// Returns: 255712345678@s.whatsapp.net
```

#### `jidToPhoneNumber(jid)`
```javascript
whatsapp.jidToPhoneNumber('255712345678@s.whatsapp.net');
// Returns: 255712345678
```

#### `isValidPhoneNumber(phoneNumber)`
```javascript
whatsapp.isValidPhoneNumber('255712345678');
// Returns: true
```

#### `generateQRCode(data)`
```javascript
const qrDataUrl = await whatsapp.generateQRCode('https://example.com');
```

#### `createContactCard(phoneNumber, name)`
```javascript
whatsapp.createContactCard('255712345678', 'John Doe');
// Returns contact vCard
```

#### `generateGroupLink(sock, groupJid)`
```javascript
const link = await whatsapp.generateGroupLink(sock, 'groupid@g.us');
// Returns: https://chat.whatsapp.com/xxxxx
```

## Phone Number Formats

The bot supports multiple phone number formats:

| Format | Example | Converted To |
|--------|---------|--------------|
| With + | +255712345678 | 255712345678 |
| Without + | 255712345678 | 255712345678 |
| With 0 | 0712345678 | 255712345678 |
| Raw | 712345678 | 712345678 |

## Bot Server Endpoints

### GET `/`
Main status endpoint
```json
{
  "status": "running",
  "name": "Peter-MD WhatsApp Bot",
  "bot": {
    "jid": "255712345678:12@s.whatsapp.net",
    "number": "255712345678",
    "name": "Peter-MD"
  },
  "qr": "Available/Not Available",
  "endpoints": {...}
}
```

### GET `/qr`
Display QR code for scanning

### GET `/whatsapp-link`
Generate WhatsApp links
```
?phone=255712345678&message=Habari
```

### GET `/status`
JSON status of bot connection

## Environment Variables

Update your `.env` file:

```env
PORT=3000
PREFIX=.
AUTO_REACT=false
```

## Starting the Bot

```bash
npm start
```

Then access:
- **QR Code:** http://localhost:3000/qr
- **Status:** http://localhost:3000/status

## Commands in WhatsApp

Once connected, use these commands in WhatsApp:

- `.ping` - Test bot response
- `.react` - Enable auto react
- `.noreact` - Disable auto react
- `.kick @user` - Remove user from group (admin only)
- `.add phone` - Add user to group (admin only)
- `.promote @user` - Make user group admin (admin only)

## Troubleshooting

### No QR Code Appearing
- Ensure bot is not already connected
- Check that the server is running on the correct port
- Restart the bot: `npm start`

### WhatsApp Link Not Working
- Verify phone number format (must include country code)
- Check that WhatsApp is installed on the device
- Try opening in WhatsApp mobile app

### Bot Not Responding
- Scan the QR code again
- Check bot console for errors
- Ensure the bot has appropriate permissions

## Integration with Your App

To use WhatsApp utilities in your code:

```javascript
const whatsapp = require('./lib/whatsapp');

// Generate a link for a user
const userPhone = '255712345678';
const link = whatsapp.generateLink(userPhone, 'Welcome to our service!');

// Convert phone to JID for sending messages
const jid = whatsapp.phoneNumberToJid(userPhone);
```

## Security Notes

- Never share QR code publicly
- Validate phone numbers before processing
- Use environment variables for sensitive data
- Implement rate limiting for endpoints in production

---

**Last Updated:** February 27, 2026
