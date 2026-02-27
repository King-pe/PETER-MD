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

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // sender jid
    joinedAt: { type: Date, default: Date.now },
    premiumUntil: { type: Date },
    isTrialUsed: { type: Boolean, default: false },
    lastOrder: {
        order_id: String,
        status: String,
        amount: Number,
        createdAt: Date
    }
});

const Setting = mongoose.model('Setting', SettingSchema);
const Session = mongoose.model('Session', SessionSchema);
const User = mongoose.model('User', UserSchema);

module.exports = { Setting, Session, User };
