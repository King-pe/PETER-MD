import { spotifydl } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka link ya Spotify'
  let res = await spotifydl(args[0])
  await conn.sendFile(m.chat, res.url, 'spotify.mp3', `🎶 ${res.title}`, m, null, { asDocument: true })
}
handler.help = ['spotify <url>']
handler.tags = ['downloader']
handler.command = ['spotify']
export default handler
