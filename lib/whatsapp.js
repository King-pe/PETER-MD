/**
 * WhatsApp Link & QR Code Manager
 * Handles WhatsApp links, QR codes, and bot messaging
 */

const QRCode = require('qrcode');

class WhatsAppManager {
    constructor() {
        this.validPhoneRegex = /^[0-9]{10,15}$/;
    }

    /**
     * Generate WhatsApp link
     * @param {string} phoneNumber - Phone number (with or without +)
     * @param {string} message - Message to send
     * @returns {string} WhatsApp link
     */
    generateLink(phoneNumber, message = '') {
        // Remove all non-numeric characters
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        if (!this.validPhoneRegex.test(cleanNumber)) {
            throw new Error('Invalid phone number format');
        }

        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    }

    /**
     * Generate QR code as data URL
     * @param {string} data - Data to encode in QR
     * @returns {Promise<string>} QR code as data URL
     */
    async generateQRCode(data) {
        try {
            return await QRCode.toDataURL(data);
        } catch (error) {
            throw new Error('QR code generation failed: ' + error.message);
        }
    }

    /**
     * Generate QR code as Buffer
     * @param {string} data - Data to encode in QR
     * @returns {Promise<Buffer>} QR code as PNG buffer
     */
    async generateQRCodeBuffer(data) {
        try {
            return await QRCode.toBuffer(data);
        } catch (error) {
            throw new Error('QR code generation failed: ' + error.message);
        }
    }

    /**
     * Format phone number to international format
     * @param {string} phoneNumber - Raw phone number
     * @returns {string} Formatted phone number
     */
    formatPhoneNumber(phoneNumber) {
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        // If starts with 255 (Tanzania), keep as is
        // If starts with 0, replace with 255 (Tanzania country code)
        if (cleanNumber.startsWith('0')) {
            return '255' + cleanNumber.substring(1);
        }
        
        return cleanNumber;
    }

    /**
     * Generate WhatsApp Group Invite Link (requires socket)
     * @param {object} sock - Baileys socket
     * @param {string} groupJid - Group JID
     * @returns {Promise<string>} Group invite link
     */
    async generateGroupLink(sock, groupJid) {
        try {
            const code = await sock.groupInviteCode(groupJid);
            return `https://chat.whatsapp.com/${code}`;
        } catch (error) {
            throw new Error('Failed to generate group link: ' + error.message);
        }
    }

    /**
     * Create WhatsApp contact card
     * @param {string} phoneNumber - Phone number
     * @param {string} name - Contact name
     * @returns {string} Contact info
     */
    createContactCard(phoneNumber, name = '') {
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        return {
            displayName: name || cleanNumber,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name || cleanNumber}\nTEL:${cleanNumber}\nEND:VCARD`
        };
    }

    /**
     * Validate WhatsApp number
     * @param {string} phoneNumber - Phone number to validate
     * @returns {boolean} True if valid
     */
    isValidPhoneNumber(phoneNumber) {
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        return this.validPhoneRegex.test(cleanNumber);
    }

    /**
     * Parse WhatsApp JID to phone number
     * @param {string} jid - WhatsApp JID (e.g., 255712345678@s.whatsapp.net)
     * @returns {string} Phone number
     */
    jidToPhoneNumber(jid) {
        return jid.split('@')[0];
    }

    /**
     * Convert phone number to JID
     * @param {string} phoneNumber - Phone number
     * @returns {string} WhatsApp JID
     */
    phoneNumberToJid(phoneNumber) {
        const cleanNumber = this.formatPhoneNumber(phoneNumber);
        return `${cleanNumber}@s.whatsapp.net`;
    }
}

module.exports = new WhatsAppManager();
