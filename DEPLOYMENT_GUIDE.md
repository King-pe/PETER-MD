# PETER-MD Deployment Guide

## Overview

This guide will help you deploy the PETER-MD WhatsApp bot on **Render** with minimal effort. The bot includes an integrated QR code scanner that automatically sends your session credentials via WhatsApp.

## Prerequisites

Before you start, ensure you have:

1. A **GitHub account** with the PETER-MD repository forked or cloned
2. A **Render account** (free tier available at [render.com](https://render.com))
3. A **WhatsApp account** on your phone
4. A **text editor** to copy/paste configuration values

## Step 1: Prepare Your Repository

### Option A: Fork the Repository

1. Visit [github.com/King-pe/PETER-MD](https://github.com/King-pe/PETER-MD)
2. Click **Fork** in the top-right corner
3. This creates a copy under your GitHub account

### Option B: Clone and Push to Your Own Repository

```bash
git clone https://github.com/King-pe/PETER-MD.git
cd PETER-MD
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Deploy on Render

### 1. Connect Your Repository

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Select **Build and deploy from a Git repository**
4. Click **Connect account** and authorize GitHub
5. Select your PETER-MD repository
6. Click **Connect**

### 2. Configure Deployment Settings

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `peter-md-bot` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (or upgrade if needed) |

### 3. Add Environment Variables

Click **Advanced** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `OWNER_NUMBER` | `255682211773` | Replace with your number (country code, no +) |
| `SUDO` | `255682211773` | Admin numbers, comma-separated |
| `PREFIX` | `.` | Command prefix |
| `MODE` | `public` | Bot mode |
| `LOG_LEVEL` | `info` | Logging level |
| `SESSION_ID` | *(leave blank for now)* | Will be filled after QR scan |

**Important:** Do NOT fill `SESSION_ID` yet. We'll get it in the next step.

### 4. Deploy

1. Click **Create Web Service**
2. Wait for the deployment to complete (2-5 minutes)
3. Once deployed, you'll see a URL like: `https://peter-md-bot.onrender.com`

## Step 3: Generate Session ID via QR Code

### 1. Access the QR Scanner

1. Open your browser and go to: `https://your-bot-name.onrender.com`
2. You should see the PETER-MD QR Scanner interface
3. The page will display a QR code

### 2. Scan with WhatsApp

1. Open **WhatsApp** on your phone
2. Go to **Settings** → **Linked Devices**
3. Tap **Link a Device**
4. **Point your phone camera at the QR code** on your screen
5. Wait for the connection to establish

### 3. Receive SESSION_ID

1. WhatsApp will send you two messages:
   - A welcome message
   - A message containing your `SESSION_ID` (starts with `PETER-MD;;;`)
2. **Copy the entire SESSION_ID** (including the `PETER-MD;;;` prefix)

## Step 4: Configure SESSION_ID on Render

### 1. Update Environment Variable

1. Go back to [dashboard.render.com](https://dashboard.render.com)
2. Click on your `peter-md-bot` service
3. Go to **Environment** tab
4. Find the `SESSION_ID` variable
5. Click **Edit** and paste your SESSION_ID
6. Click **Save**

### 2. Redeploy

1. The service will automatically redeploy with the new SESSION_ID
2. Wait for deployment to complete
3. Check the **Logs** tab to confirm the bot is connected

## Step 5: Verify Bot Connection

### Check Logs

1. In the Render dashboard, go to your service
2. Click **Logs** tab
3. Look for messages like:
   - `✅ Session restored successfully`
   - `✅ Bot connected successfully!`

### Test the Bot

1. Send a message to your WhatsApp bot number
2. The bot should respond with a welcome message or command list

## Troubleshooting

### Issue: "No SESSION_ID found" Error

**Solution:** 
- Ensure you've set the `SESSION_ID` environment variable on Render
- Redeploy the service after adding the variable
- Check that the SESSION_ID is complete (includes `PETER-MD;;;` prefix)

### Issue: QR Code Not Loading

**Solution:**
- Refresh the page (`Ctrl+F5` or `Cmd+Shift+R`)
- Check your internet connection
- Ensure the Render service is running (check Logs tab)
- Try accessing `/qr` endpoint directly: `https://your-bot-name.onrender.com/qr`

### Issue: WhatsApp Connection Fails

**Solution:**
- Ensure your phone's WhatsApp is updated
- Try scanning the QR code again
- Check that your phone number is correct in `OWNER_NUMBER`
- Wait 30 seconds and refresh the page

### Issue: Bot Crashes or Restarts Frequently

**Solution:**
- Check the **Logs** tab for error messages
- Ensure all required environment variables are set
- Verify that `SESSION_ID` is valid and complete
- Try upgrading to a paid Render plan if using Free tier

## Advanced Configuration

### Custom Prefix

To change the command prefix (default is `.`):

1. Go to Render dashboard
2. Edit the `PREFIX` environment variable
3. Set to your preferred prefix (e.g., `!`, `#`, etc.)
4. Redeploy

### Admin Numbers

To add multiple admin numbers:

1. Edit the `SUDO` environment variable
2. Use comma-separated format: `255123456789,255987654321`
3. Redeploy

### Database Integration (Optional)

To use a database:

1. Set `MONGODB_URI` or `DATABASE_URL` environment variable
2. Provide your database connection string
3. Redeploy

## Security Best Practices

⚠️ **Important Security Tips:**

1. **Never share your SESSION_ID** - Anyone with it can access your WhatsApp
2. **Keep environment variables private** - Don't commit `.env` files to Git
3. **Use strong admin numbers** - Only add trusted numbers as SUDO
4. **Monitor logs regularly** - Check for suspicious activity
5. **Update regularly** - Keep the bot code updated for security patches

## Getting Help

- **GitHub Issues:** [github.com/King-pe/PETER-MD/issues](https://github.com/King-pe/PETER-MD/issues)
- **WhatsApp Support:** [wa.me/255682211773](https://wa.me/255682211773)
- **Discord Community:** [Join our Discord](https://discord.gg/example)

## Next Steps

After successful deployment:

1. **Learn bot commands** - Check the plugins directory for available commands
2. **Customize the bot** - Edit configuration files as needed
3. **Add custom commands** - Create new plugins in the `plugins` directory
4. **Monitor performance** - Use Render's monitoring tools

## FAQ

**Q: Can I use this on other platforms?**
A: Yes! The bot works on Heroku, Railway, Koyeb, and other Node.js hosting platforms. Adjust configuration files accordingly.

**Q: How often do I need to renew the SESSION_ID?**
A: SESSION_ID is persistent. You only need to generate a new one if you unlink the device from WhatsApp.

**Q: Can I run multiple bots?**
A: Yes, create separate Render services for each bot with different SESSION_IDs.

**Q: Is the free Render plan sufficient?**
A: Yes, for personal use. Upgrade if you need better performance or higher uptime.

---

**Happy botting! 🤖**

For the latest updates and community support, visit [github.com/King-pe/PETER-MD](https://github.com/King-pe/PETER-MD)
