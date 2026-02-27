const mongoose = require("mongoose");
const { Setting, Session, User } = require("./schema");

async function connectDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log("🌍 Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
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

async function getUser(jid) {
    let user = await User.findOne({ id: jid });
    if (!user) {
        // New user gets 30 days free trial
        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + 30);
        
        user = new User({ 
            id: jid, 
            premiumUntil: trialExpiry,
            isTrialUsed: true 
        });
        await user.save();
    }
    return user;
}

async function updateUser(jid, update) {
    return await User.findOneAndUpdate({ id: jid }, update, { new: true, upsert: true });
}


module.exports = { connectDB, getSetting, updateSetting, getUser, updateUser };
