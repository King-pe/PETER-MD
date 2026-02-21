const fetch = require('node-fetch');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Usage: ${usedPrefix + command} <song name>`;

  let query = args.join(" ");
  let search = await yts(query);
  if (!search.videos.length) throw '❎ Song not found';

  let vid = search.videos[0];

  let info = await ytdl.getInfo(vid.url);
  let format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

  let caption = `
🎶 *YouTube Play*
▢ *Title:* ${vid.title}
▢ *Duration:* ${vid.timestamp}
▢ *Views:* ${vid.views}
▢ *Uploaded:* ${vid.ago}
  `.trim();

  await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption }, { quoted: m });
  await conn.sendFile(m.chat, format.url, `${vid.title}.mp3`, null, m, true, { mimetype: 'audio/mp4' });
};

handler.help = ['play <song name>'];
handler.tags = ['downloader'];
handler.command = ['play', 'ytplay'];

module.exports = handler;
