const mongoose = require('mongoose');
const { Setting } = require('./schema');

async function connectDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log('🌍 Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
}

async function getSetting(jid) {
    let setting = await Setting.findOne({ id: jid });
    if (!setting) {
        setting = new Setting({ id: jid });
        await setting.save();
    }
    return setting;
}

async function updateSetting(jid, update) {
    return await Setting.findOneAndUpdate({ id: jid }, update, { new: true, upsert: true });
}

module.exports = { connectDB, getSetting, updateSetting };
