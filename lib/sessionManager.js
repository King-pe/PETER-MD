/**
 * Session Manager
 * Handles encoding/decoding of creds.json and session persistence
 */

const fs = require('fs-extra');
const path = require('path');

class SessionManager {
    constructor(sessionDir = path.join(__dirname, '..', 'session')) {
        this.sessionDir = sessionDir;
        this.credsPath = path.join(this.sessionDir, 'creds.json');
        
        // Ensure session directory exists
        if (!fs.existsSync(this.sessionDir)) {
            fs.mkdirSync(this.sessionDir, { recursive: true });
        }
    }

    /**
     * Check if a session exists
     * @returns {boolean} True if session file exists
     */
    hasSession() {
        return fs.existsSync(this.credsPath);
    }

    /**
     * Encode creds.json to SESSION_ID format
     * @param {string} credsPath - Path to creds.json file
     * @returns {Promise<string>} Base64 encoded SESSION_ID
     */
    async encodeSession(credsPath) {
        try {
            if (!fs.existsSync(credsPath)) {
                throw new Error(`Credentials file not found: ${credsPath}`);
            }

            const credsData = await fs.readFile(credsPath);
            const base64 = Buffer.from(credsData).toString('base64');
            const sessionId = `PETER-MD;;;${base64}`;
            
            return sessionId;
        } catch (error) {
            console.error('❌ Error encoding session:', error.message);
            throw error;
        }
    }

    /**
     * Decode SESSION_ID and restore creds.json
     * @param {string} sessionId - SESSION_ID string (PETER-MD;;;base64data)
     * @returns {Promise<boolean>} True if session was restored successfully
     */
    async restoreSession(sessionId) {
        try {
            if (!sessionId || typeof sessionId !== 'string') {
                throw new Error('Invalid SESSION_ID format');
            }

            // Extract base64 part
            const parts = sessionId.split(';;;');
            if (parts.length !== 2 || parts[0] !== 'PETER-MD') {
                throw new Error('SESSION_ID must start with PETER-MD;;;');
            }

            const base64Data = parts[1];
            
            // Decode base64
            const credsBuffer = Buffer.from(base64Data, 'base64');
            
            // Validate JSON
            let credsJson;
            try {
                credsJson = JSON.parse(credsBuffer.toString());
            } catch (e) {
                throw new Error('Invalid JSON in decoded credentials');
            }

            // Write to session directory
            await fs.writeFile(this.credsPath, credsBuffer);
            
            console.log('✅ Session restored to:', this.credsPath);
            return true;

        } catch (error) {
            console.error('❌ Error restoring session:', error.message);
            return false;
        }
    }

    /**
     * Get the session directory path
     * @returns {string} Path to session directory
     */
    getSessionDir() {
        return this.sessionDir;
    }

    /**
     * Get the creds.json path
     * @returns {string} Path to creds.json
     */
    getCredsPath() {
        return this.credsPath;
    }

    /**
     * Clear session (delete creds.json)
     * @returns {Promise<boolean>} True if session was cleared
     */
    async clearSession() {
        try {
            if (fs.existsSync(this.credsPath)) {
                await fs.remove(this.credsPath);
                console.log('✅ Session cleared');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error clearing session:', error.message);
            return false;
        }
    }

    /**
     * Get session info
     * @returns {Promise<object>} Session information
     */
    async getSessionInfo() {
        try {
            const exists = this.hasSession();
            let info = {
                exists,
                path: this.credsPath,
                timestamp: null,
                size: null
            };

            if (exists) {
                const stats = await fs.stat(this.credsPath);
                info.timestamp = stats.mtime;
                info.size = stats.size;
            }

            return info;
        } catch (error) {
            console.error('❌ Error getting session info:', error.message);
            return null;
        }
    }

    /**
     * Validate SESSION_ID format
     * @param {string} sessionId - SESSION_ID to validate
     * @returns {boolean} True if valid format
     */
    validateSessionId(sessionId) {
        if (!sessionId || typeof sessionId !== 'string') {
            return false;
        }

        const parts = sessionId.split(';;;');
        if (parts.length !== 2 || parts[0] !== 'PETER-MD') {
            return false;
        }

        try {
            Buffer.from(parts[1], 'base64');
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = SessionManager;
