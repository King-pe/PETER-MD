const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // jid for groups or 'global'
    react: { type: Boolean, default: false },
    statusview: { type: Boolean, default: false },
    statuscomment: { type: Boolean, default: false },
    statusreply: { type: String, default: '🔥 Nice status!' },
    prefix: { type: String, default: '.' }
});

const SessionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    session: { type: String, required: true }
});

const Setting = mongoose.model('Setting', SettingSchema);
const Session = mongoose.model('Session', SessionSchema);

module.exports = { Setting, Session };
