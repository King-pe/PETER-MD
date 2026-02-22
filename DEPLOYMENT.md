# PETER-MD Deployment Guide

This guide will help you deploy PETER-MD on Render with integrated session generation.

## Prerequisites

- A GitHub account
- A Render account (free tier available)
- A MongoDB account (free tier available)
- A WhatsApp account

## Step 1: Fork the Repository

1. Go to [PETER-MD Repository](https://github.com/King-pe/PETER-md)
2. Click the **Fork** button at the top right
3. Select your account to fork the repository

## Step 2: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new project
4. Create a cluster (free tier)
5. Create a database user with a password
6. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)

## Step 3: Deploy on Render

1. Go to [Render](https://render.com)
2. Sign up or log in with your GitHub account
3. Click **New +** → **Web Service**
4. Connect your forked PETER-MD repository
5. Fill in the following details:

   | Field | Value |
   |-------|-------|
   | **Name** | `peter-md` (or any name you prefer) |
   | **Environment** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |

6. Click **Create Web Service**

## Step 4: Add Environment Variables

Once your service is created:

1. Go to **Environment** tab
2. Add the following variables:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `OWNER_NUMBER` | Your WhatsApp number (e.g., `255682211773`) |
   | `SUDO` | Your WhatsApp number |
   | `PREFIX` | `.` (or your preferred prefix) |
   | `MODE` | `public` |

3. Click **Save**

## Step 5: Get Your Session ID

1. Once the deployment is complete, go to your Render app URL (e.g., `https://peter-md.onrender.com`)
2. You'll see two options:
   - **QR Scan**: Scan with your phone
   - **Pair Code**: Use a pairing code
3. Choose one and follow the instructions
4. Your `SESSION_ID` will be sent to your WhatsApp inbox
5. Copy the `SESSION_ID` (it starts with `PETER-MD;;;`)

## Step 6: Add Session ID to Environment

1. Go back to your Render service
2. Go to **Environment** tab
3. Add a new variable:
   - **Key**: `SESSION_ID`
   - **Value**: Paste your session ID
4. Click **Save**
5. Your service will automatically redeploy with the session

## Step 7: Verify Bot is Running

1. Wait for the deployment to complete
2. Check the logs to ensure there are no errors
3. Send a message to your bot to test it

## Troubleshooting

### Bot not responding
- Check if `SESSION_ID` is correctly set
- Check the logs for errors
- Try restarting the service

### QR Code not loading
- Refresh the page
- Check your internet connection
- Try the Pair Code option instead

### MongoDB connection error
- Verify your `MONGODB_URI` is correct
- Check if your MongoDB cluster is active
- Ensure your IP is whitelisted in MongoDB Atlas

## Support

- **Owner**: [Peter Joram](https://wa.me/255715654328)
- **WhatsApp Group**: [Join Here](https://chat.whatsapp.com/I98ptwPbiFd7CvHXtcJMxp)
- **GitHub Issues**: [Report Here](https://github.com/King-pe/PETER-md/issues)

---

*Made with ❤️ by Peter-MD Tech*
