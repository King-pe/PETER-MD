const bot = require(__dirname + '/lib/amd');
const { VERSION } = require(__dirname + '/config');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Routes for Session Generation
const qrRouter = require('./qr-server/qr');
const pairRouter = require('./qr-server/pair');
app.use('/qr', qrRouter);
app.use('/code', pairRouter);

app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'qr-server', 'pair.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'qr-server', 'main.html'));
});

// Start Bot Logic
const startBot = async () => {
    console.log(`🚀 Starting PETER-MD ${VERSION}`);
    try {
        if (process.env.SESSION_ID) {
            await bot.init();
            await bot.DATABASE.sync();
            await bot.connect();
        } else {
            console.log("⚠️ No SESSION_ID found. Please visit the web interface to get one.");
        }
    } catch (error) {
        console.error("❌ Bot Start Error:", error);
        // Retry after delay
        setTimeout(startBot, 5000);
    }
};

// Start Server and Bot
app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
    console.log(`👉 Get Session at: http://localhost:${PORT}`);
    startBot();
});
