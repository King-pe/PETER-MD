const { getSetting, updateSetting } = require('../database/db');

async function handleCommand(sock, m, body, prefix) {
    const isGroup = m.key.remoteJid.endsWith('@g.us');
    const sender = m.key.participant || m.key.remoteJid;
    const from = m.key.remoteJid;
    const args = body.trim().split(/ +/).slice(1);
    const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

    // Helper: Check if user is admin
    const checkAdmin = async (jid, user) => {
        const metadata = await sock.groupMetadata(jid);
        const participants = metadata.participants;
        const participant = participants.find(p => p.id === user);
        return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
    };

    // Helper: Check if bot is admin
    const checkBotAdmin = async (jid) => {
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        return await checkAdmin(jid, botNumber);
    };

    const reply = async (text) => {
        await sock.sendMessage(from, { text }, { quoted: m });
    };

    switch (command) {
        case 'kick':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            let userToKick = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (!userToKick) return reply('Tag au weka namba ya kumtoa.');
            await sock.groupParticipantsUpdate(from, [userToKick], 'remove');
            reply('Tayari!');
            break;

        case 'add':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            let userToAdd = args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (!userToAdd) return reply('Weka namba ya kuongeza.');
            await sock.groupParticipantsUpdate(from, [userToAdd], 'add');
            reply('Tayari!');
            break;

        case 'promote':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            let userToPromote = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!userToPromote) return reply('Tag mtu wa kumfanya admin.');
            await sock.groupParticipantsUpdate(from, [userToPromote], 'promote');
            reply('Tayari!');
            break;

        case 'demote':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            let userToDemote = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (!userToDemote) return reply('Tag admin wa kumshusha.');
            await sock.groupParticipantsUpdate(from, [userToDemote], 'demote');
            reply('Tayari!');
            break;

        case 'open':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            await sock.groupSettingUpdate(from, 'not_announcement');
            reply('Kikundi kimefunguliwa kwa kila mtu.');
            break;

        case 'close':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            await sock.groupSettingUpdate(from, 'announcement');
            reply('Kikundi kimefungwa kwa admin tu.');
            break;

        case 'groupname':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            if (!args.length) return reply('Weka jina jipya.');
            await sock.groupUpdateSubject(from, args.join(' '));
            reply('Jina limebadilishwa.');
            break;

        case 'groupdesc':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            if (!args.length) return reply('Weka maelezo mapya.');
            await sock.groupUpdateDescription(from, args.join(' '));
            reply('Maelezo yamebadilishwa.');
            break;

        case 'tagall':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            const metadata = await sock.groupMetadata(from);
            let participants = metadata.participants.map(p => p.id);
            let msg = args.length ? args.join(' ') : 'Habari kila mtu!';
            await sock.sendMessage(from, { text: msg, mentions: participants });
            break;

        case 'groupinfo':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            const meta = await sock.groupMetadata(from);
            let info = `*JINA:* ${meta.subject}\n*ID:* ${meta.id}\n*ADMINS:* ${meta.participants.filter(p => p.admin).length}\n*WASHIRIKI:* ${meta.participants.length}\n*MAELEZO:* ${meta.desc || 'Hakuna'}`;
            reply(info);
            break;

        case 'link':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            const code = await sock.groupInviteCode(from);
            reply(`https://chat.whatsapp.com/${code}`);
            break;

        case 'resetlink':
            if (!isGroup) return reply('Amri hii inafanya kazi kwenye vikundi tu.');
            if (!(await checkAdmin(from, sender))) return reply('Wewe si admin.');
            if (!(await checkBotAdmin(from))) return reply('Bot lazima awe admin.');
            await sock.groupRevokeInvite(from);
            reply('Link imebadilishwa.');
            break;

        case 'react':
            if (!args[0]) return reply('Tumia: .react on/off');
            if (args[0] === 'on') {
                await updateSetting(from, { react: true });
                reply('Auto-React imewashwa.');
            } else if (args[0] === 'off') {
                await updateSetting(from, { react: false });
                reply('Auto-React imezimwa.');
            }
            break;

        case 'statusview':
            if (!args[0]) return reply('Tumia: .statusview on/off');
            if (args[0] === 'on') {
                await updateSetting('global', { statusview: true });
                reply('Status Auto-View imewashwa.');
            } else if (args[0] === 'off') {
                await updateSetting('global', { statusview: false });
                reply('Status Auto-View imezimwa.');
            }
            break;

        case 'statuscomment':
            if (!args[0]) return reply('Tumia: .statuscomment on/off');
            if (args[0] === 'on') {
                await updateSetting('global', { statuscomment: true });
                reply('Status Auto-Comment imewashwa.');
            } else if (args[0] === 'off') {
                await updateSetting('global', { statuscomment: false });
                reply('Status Auto-Comment imezimwa.');
            }
            break;

        case 'setstatusreply':
            if (!args.length) return reply('Weka ujumbe wa reply.');
            await updateSetting('global', { statusreply: args.join(' ') });
            reply('Ujumbe wa status reply umehifadhiwa.');
            break;
    }
}

module.exports = { handleCommand };
