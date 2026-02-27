# 🎯 Command Reference Card

## WhatsApp Bot Commands

### QR Code Commands

```
.qr                    
.qr contact           
.qr contact "msg"     
.qr group             
.qr status            
.qr dashboard         
.qr help              
```

#### Detailed Usage

| Command | Purpose | Example |
|---------|---------|---------|
| `.qr` | Default contact QR | `.qr` |
| `.qr contact` | Contact QR | `.qr contact` |
| `.qr contact "message"` | Contact with custom message | `.qr contact "Habari!"` |
| `.qr group` | Group invite QR | `.qr group` |
| `.qr status` | Bot status info | `.qr status` |
| `.qr dashboard` | Web dashboard link | `.qr dashboard` |
| `.qr help` | QR command help | `.qr help` |

---

### General Bot Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `.ping` | Check if bot is online | `.ping` |
| `.status` | Show full bot status | `.status` |
| `.react` | Turn on auto-react | `.react` |
| `.noreact` | Turn off auto-react | `.noreact` |

---

### Group Commands (Admin Only)

| Command | Purpose | Example |
|---------|---------|---------|
| `.promote @user` | Make user group admin | `.promote @friend` |
| `.kick @user` | Remove user from group | `.kick @spam` |
| `.add 255...` | Add user to group | `.add 255712345678` |

---

## Web Endpoints

### Main Dashboard
```
http://localhost:3000/qrpage
```
**Features:**
- Full QR dashboard
- Multiple QR codes
- Instructions in Swahili
- Auto-refresh every 60s

### Single QR Code
```
http://localhost:3000/qr
```
**Features:**
- Single QR code
- Auto-refresh every 30s
- Used during bot login

### Direct Contact QR
```
http://localhost:3000/qr/contact
```
**Usage:**
```
?msg=Your+message+here
```

### Strategy Dashboard
```
http://localhost:3000/qr/dashboard
```
**Features:**
- 6 different QR strategies
- Usage recommendations
- Interactive interface

### Bot Status
```
http://localhost:3000/status
```
**Returns JSON:**
```json
{
  "status": "Connected ✅",
  "botNumber": "+255682211773",
  "port": 3000,
  "version": "1.0.0"
}
```

### Custom QR Generator
```
http://localhost:3000/qr/custom?type=contact&data=Message
```

---

## Quick Examples

### Example 1: Customer Contact
```
.qr contact Mnahitaji msaada kwa orders
```
→ Generates QR with customer support message

### Example 2: Group Promotion
```
.qr group
```
→ QR code to join the bot support group

### Example 3: Check Bot
```
.status
```
→ Shows bot information and status

### Example 4: Web Dashboard
Open browser to:
```
http://localhost:3000/qrpage
```

---

## Command Structure

### Basic Format
```
PREFIX + COMMAND + ARGUMENTS
  .         qr      contact "message"
```

### Parsing Rules
- **Prefix:** `.` (configurable in .env)
- **Command:** `qr` (case-insensitive)
- **Arguments:** Space-separated
- **Messages:** Use quotes for multi-word

---

## Common Errors & Solutions

### "❌ Unknown QR command"
**Cause:** Invalid subcommand
**Solution:** Use `.qr help`

### "❌ GURL haijawekwa"
**Cause:** Group link not in .env
**Solution:** Add `GURL=...` to .env

### "❌ Bot haijaunganishi"
**Cause:** Bot not connected yet
**Solution:** Wait for connection

### "No QR Available"
**Cause:** QR not generated yet
**Solution:** Wait for bot login

---

## Configuration Variables

```bash
# Required
MONGODB_URI=mongodb+srv://...
OWNER_NUMBER=255682211773

# Optional but Recommended
PREFIX=.
PORT=3000
GURL=https://chat.whatsapp.com/...
AUTO_REACT=false

# QR Specific
# (Configured in code, customizable)
QR_SIZE=300
QR_MARGIN=1
QR_REFRESH=60000
```

---

## Response Examples

### After `.qr contact`
```
💬 Image: QR Code PNG
Caption: "Scan hii kumjumua bot moja kwa moja"
```

### After `.qr group`
```
👥 Image: QR Code PNG
Caption: "Scan hii kujiunge na kikundi cha bot"
```

### After `.status`
```
🤖 *Peter-MD Bot - Hali*
━━━━━━━━━━━━━━━━━━
✅ Status: Online
📱 Namba: +255682211773
🔧 Version: 1.0.0
⚙️ Prefix: .
🌐 Server: Port 3000
━━━━━━━━━━━━━━━━━━
```

### After `.qr help`
```
📚 *QR Code Commands Help*
━━━━━━━━━━━━━━━━━━
🔹 .qr contact [ujumbe]
🔹 .qr group
🔹 .qr status
🔹 .qr help
━━━━━━━━━━━━━━━━━━
```

---

## Advanced Usage

### Programmatically Generate QR
```javascript
const qrHandler = require('./lib/qrhandler');

// Generate contact QR
const qr = await qrHandler.generateContactQR('255682211773', 'Hello');

// Generate group QR
const groupQR = await qrHandler.generateGroupQR(groupLink);

// Generate HTML page
const page = await qrHandler.generateQRPage(phone, groupLink);
```

### Using QR Strategies
```javascript
const strategies = require('./lib/qrstrategies');

// Time-based QR
const conditionalQR = await strategies.conditionalQR('255...');

// Event-based QR
const eventQR = await strategies.eventBasedQR('255...', 'birthday');

// All strategies
const allQRs = await strategies.generateAllStrategies('255...');
```

---

## Keyboard Shortcuts

### WhatsApp Mobile
```
. + qr + [subcommand]
```

### Web Interface
```
Ctrl + Click → Open in new tab
F5 → Refresh page
Ctrl + F → Find on page
```

---

## Performance Tips

1. **Fast Response:** Use `.qr` without arguments
2. **Custom Messages:** Keep under 100 characters
3. **Group Link:** Set in .env once
4. **Web Access:** Open from same network
5. **Multiple Scans:** Use different strategies

---

## Support Resources

- **Quick Guide:** [QUICKSTART.md](QUICKSTART.md)
- **Full Guide:** [QR_CODE_GUIDE.md](QR_CODE_GUIDE.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Summary:** [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## Keyboard Input Guide

### WhatsApp Input
```
Mobile:
  Type message
  Long press send
  → QR code appears

Desktop:
  Type message
  Click send
  → QR code appears
```

### Web Input
```
Browser address bar
Type URL
Press Enter
→ Page loads
```

---

## Rate Limits

- QR Generation: Unlimited
- Web Requests: ~1000/min
- WhatsApp Messages: Bot limits apply
- File Storage: Auto-cleanup enabled

---

## Data Storage

```
Stored:
- QR files (auto-cleanup after 1 hour)
- Session files
- Bot credentials
- Message history (if database configured)

Not Stored:
- QR code generation requests
- Web dashboard views
- Command history (unless implemented)
```

---

**Quick Reference Guide for Peter-MD Bot**
**Version: 1.0.0**
**Last Updated: Feb 27, 2026**

---

## Bookmark These URLs

```
Local Dashboard:
http://localhost:3000/qrpage

Bot Status:
http://localhost:3000/status

QR Strategies:
http://localhost:3000/qr/dashboard

Direct QR:
http://localhost:3000/qr/contact
```

---

**Happy Botting! 🚀**
