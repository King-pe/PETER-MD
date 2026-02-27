const fs = require('fs');
const path = require('path');

// Function to clean up sessions folder
function cleanupSessions() {
    const sessionsDir = path.join(process.cwd(), 'sessions');
    if (fs.existsSync(sessionsDir)) {
        try {
            fs.rmSync(sessionsDir, { recursive: true, force: true });
            console.log('✅ Sessions folder cleaned up successfully');
            console.log('🔄 Please restart the bot to generate a new pairing code');
        } catch (err) {
            console.error('❌ Error cleaning sessions:', err);
        }
    } else {
        console.log('ℹ️ Sessions folder does not exist');
    }
}

cleanupSessions();
