/**
 * Connection Handler
 * Manages WhatsApp connection lifecycle and events
 */

const { DisconnectReason } = require('@whiskeysockets/baileys');
const Pino = require('pino');

class ConnectionHandler {
    constructor(socket, options = {}) {
        this.socket = socket;
        this.logger = Pino({ level: 'silent' });
        this.options = {
            maxRetries: options.maxRetries || 5,
            retryDelay: options.retryDelay || 5000,
            ...options
        };
        this.retryCount = 0;
        this.isConnected = false;
    }

    /**
     * Setup connection event listeners
     */
    setupListeners() {
        this.socket.ev.on('connection.update', (update) => this.handleConnectionUpdate(update));
        this.socket.ev.on('creds.update', (update) => this.handleCredsUpdate(update));
        this.socket.ev.on('messages.upsert', (update) => this.handleMessagesUpsert(update));
        this.socket.ev.on('message.edit', (update) => this.handleMessageEdit(update));
        this.socket.ev.on('message.delete', (update) => this.handleMessageDelete(update));
        this.socket.ev.on('chats.upsert', (update) => this.handleChatsUpsert(update));
        this.socket.ev.on('chats.update', (update) => this.handleChatsUpdate(update));
        this.socket.ev.on('presence.update', (update) => this.handlePresenceUpdate(update));
        this.socket.ev.on('contacts.upsert', (update) => this.handleContactsUpsert(update));
        this.socket.ev.on('groups.upsert', (update) => this.handleGroupsUpsert(update));
        this.socket.ev.on('group-participants.update', (update) => this.handleGroupParticipantsUpdate(update));
    }

    /**
     * Handle connection updates
     */
    async handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr, isOnline, isNewLogin } = update;

        if (qr) {
            console.log('📱 QR Code generated, awaiting scan...');
            // Emit QR event for external handlers
            this.socket.emit('qr-generated', qr);
        }

        if (connection === 'connecting') {
            console.log('🔄 Connecting to WhatsApp...');
        }

        if (connection === 'open') {
            console.log('✅ Connected to WhatsApp');
            this.isConnected = true;
            this.retryCount = 0;
            this.socket.emit('connection-open');
        }

        if (connection === 'close') {
            this.isConnected = false;
            const shouldReconnect = this.shouldReconnect(lastDisconnect?.error?.output?.statusCode);
            
            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                this.retryCount++;
                if (this.retryCount <= this.options.maxRetries) {
                    setTimeout(() => {
                        this.socket.emit('reconnect');
                    }, this.options.retryDelay);
                } else {
                    console.error('❌ Max retries exceeded');
                    this.socket.emit('connection-failed');
                }
            } else {
                console.log('❌ Connection closed by user or logout');
                this.socket.emit('connection-closed');
            }
        }

        if (isOnline !== undefined) {
            console.log(`📡 Online status: ${isOnline ? 'Online' : 'Offline'}`);
        }

        if (isNewLogin) {
            console.log('🆕 New login detected');
        }
    }

    /**
     * Handle credentials update
     */
    async handleCredsUpdate(update) {
        console.log('💾 Credentials updated');
        this.socket.emit('creds-updated', update);
    }

    /**
     * Handle incoming messages
     */
    async handleMessagesUpsert(update) {
        if (update.type === 'notify') {
            console.log(`📨 ${update.messages.length} new message(s)`);
            this.socket.emit('messages-received', update.messages);
        }
    }

    /**
     * Handle message edits
     */
    async handleMessageEdit(update) {
        console.log('✏️  Message edited');
        this.socket.emit('message-edited', update);
    }

    /**
     * Handle message deletes
     */
    async handleMessageDelete(update) {
        console.log('🗑️  Message deleted');
        this.socket.emit('message-deleted', update);
    }

    /**
     * Handle chat updates
     */
    async handleChatsUpsert(update) {
        console.log(`💬 ${update.length} chat(s) upserted`);
        this.socket.emit('chats-upserted', update);
    }

    /**
     * Handle chat updates
     */
    async handleChatsUpdate(update) {
        console.log(`💬 ${update.length} chat(s) updated`);
        this.socket.emit('chats-updated', update);
    }

    /**
     * Handle presence updates
     */
    async handlePresenceUpdate(update) {
        this.socket.emit('presence-updated', update);
    }

    /**
     * Handle contact updates
     */
    async handleContactsUpsert(update) {
        console.log(`👥 ${update.length} contact(s) upserted`);
        this.socket.emit('contacts-upserted', update);
    }

    /**
     * Handle group updates
     */
    async handleGroupsUpsert(update) {
        console.log(`👨‍👩‍👧‍👦 ${update.length} group(s) upserted`);
        this.socket.emit('groups-upserted', update);
    }

    /**
     * Handle group participant updates
     */
    async handleGroupParticipantsUpdate(update) {
        console.log(`👥 Group participants updated: ${update.id}`);
        this.socket.emit('group-participants-updated', update);
    }

    /**
     * Determine if reconnection should be attempted
     */
    shouldReconnect(statusCode) {
        // Don't reconnect if logged out or unauthorized
        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
            return false;
        }
        return true;
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            retryCount: this.retryCount,
            maxRetries: this.options.maxRetries
        };
    }

    /**
     * Disconnect gracefully
     */
    async disconnect() {
        try {
            if (this.socket && this.socket.ws) {
                this.socket.ws.close();
                console.log('✅ Disconnected from WhatsApp');
            }
        } catch (error) {
            console.error('❌ Error disconnecting:', error.message);
        }
    }
}

module.exports = ConnectionHandler;
