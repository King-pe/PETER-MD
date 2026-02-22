/**
 * PETER-MD Bot - Main Entry Point
 * Enhanced version with improved session management and error handling
 */

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import bot modules
const bot = require(__dirname + '/lib/amd');
const { VERSION } = require(__dirname + '/config');
const SessionManager = require(__dirname + '/lib/sessionManager');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure required directories exist
const tempDir = path.join(__dirname, 'temp');
const sessionDir = path.join(__dirname, 'session');
const publicDir = path.join(__dirname, 'public');

[tempDir, sessionDir, publicDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Initialize Session Manager
const sessionManager = new SessionManager(sessionDir);

// Routes for QR Code and Pairing
const qrRouter = require('./qr-server/qr');
const pairRouter = require('./qr-server/pair');

app.use('/qr', qrRouter);
app.use('/code', pairRouter);

// Serve HTML pages
app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'qr-server', 'pair.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'qr-server', 'main.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        version: VERSION,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    const hasSession = sessionManager.hasSession();
    res.json({
        status: hasSession ? 'ready' : 'waiting_for_session',
        version: VERSION,
        sessionExists: hasSession,
        timestamp: new Date().toISOString()
    });
});

/**
 * Start Bot Logic
 * Initializes the WhatsApp bot connection
 */
const startBot = async () => {
    console.log(`\n🚀 Starting PETER-MD ${VERSION}`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    
    try {
        // Check if SESSION_ID is provided
        if (!process.env.SESSION_ID) {
            console.log('\n⚠️  No SESSION_ID found in environment variables.');
            console.log('📱 Please visit the web interface to generate one:');
            console.log(`   🌐 http://localhost:${PORT}`);
            console.log(`   🌐 or http://localhost:${PORT}/qr\n`);
            return;
        }

        // Decode and restore session
        console.log('🔐 Decoding SESSION_ID...');
        const sessionRestored = await sessionManager.restoreSession(process.env.SESSION_ID);
        
        if (!sessionRestored) {
            console.error('❌ Failed to restore session from SESSION_ID');
            console.log('⚠️  Please generate a new SESSION_ID by visiting the web interface.');
            return;
        }

        console.log('✅ Session restored successfully');

        // Initialize bot
        console.log('🤖 Initializing bot...');
        await bot.init();
        
        // Sync database
        console.log('💾 Syncing database...');
        await bot.DATABASE.sync();
        
        // Connect to WhatsApp
        console.log('📡 Connecting to WhatsApp...');
        await bot.connect();
        
        console.log('✅ Bot connected successfully!\n');

    } catch (error) {
        console.error('❌ Bot Start Error:', error.message);
        console.error('Stack:', error.stack);
        
        // Retry after delay
        console.log('🔄 Retrying in 10 seconds...\n');
        setTimeout(startBot, 10000);
    }
};

/**
 * Graceful Shutdown Handler
 */
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    try {
        await bot.disconnect();
        console.log('✅ Bot disconnected');
    } catch (err) {
        console.error('Error during shutdown:', err);
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n\n🛑 Shutting down gracefully (SIGTERM)...');
    try {
        await bot.disconnect();
        console.log('✅ Bot disconnected');
    } catch (err) {
        console.error('Error during shutdown:', err);
    }
    process.exit(0);
});

/**
 * Error Handlers
 */
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Start Server and Bot
 */
const server = app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  🌐 PETER-MD Bot Server Started       ║`);
    console.log(`║  Version: ${VERSION.padEnd(27)} ║`);
    console.log(`║  Port: ${PORT.toString().padEnd(30)} ║`);
    console.log(`╠════════════════════════════════════════╣`);
    console.log(`║  📍 Web Interface:                     ║`);
    console.log(`║     http://localhost:${PORT}${' '.repeat(19)}║`);
    console.log(`║  📍 QR Code Scanner:                   ║`);
    console.log(`║     http://localhost:${PORT}/qr${' '.repeat(13)}║`);
    console.log(`║  📍 Health Check:                      ║`);
    console.log(`║     http://localhost:${PORT}/health${' '.repeat(9)}║`);
    console.log(`╚════════════════════════════════════════╝\n`);
    
    // Start bot after server is ready
    startBot();
});

/**
 * Server Error Handler
 */
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
    } else {
        console.error('❌ Server Error:', error);
    }
    process.exit(1);
});

module.exports = app;
