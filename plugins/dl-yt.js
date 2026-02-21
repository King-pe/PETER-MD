const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Usage: ${usedPrefix + command} <youtube link | search query>`;

  let url = args[0];
  let vid;

  // kama sio link, tafuta kwenye YouTube
  if (!url.startsWith("http")) {
    let search = await yts(args.join(" "));
    if (!search.videos.length) throw '❎ Video not found';
    vid = search.videos[0];
    url = vid.url;
  } else {
    let info = await ytdl.getInfo(url);
    vid = { 
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
      thumbnail: info.videoDetails.thumbnails[0].url
    };
  }

  let caption = `
🎥 *YouTube Downloader*
▢ *Title:* ${vid.title}
▢ *Url:* ${vid.url}
  `.trim();

  await conn.sendMessage(m.chat, { image: { url: vid.thumbnail }, caption }, { quoted: m });

  if (/audio/i.test(command)) {
    let audio = ytdl(url, { filter: 'audioonly' });
    await conn.sendFile(m.chat, audio, `${vid.title}.mp3`, null, m, true, { mimetype: 'audio/mp4' });
  } else {
    let video = ytdl(url, { filter: 'videoandaudio', quality: '18' });
    await conn.sendFile(m.chat, video, `${vid.title}.mp4`, null, m, true, { mimetype: 'video/mp4' });
  }
};

handler.help = ['ytmp3 <url|query>', 'ytmp4 <url|query>'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'ytmp4', 'ytaudio', 'ytvideo'];

module.exports = handler;
