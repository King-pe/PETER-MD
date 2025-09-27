import { soundcloud } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka link ya SoundCloud'
  let res = await soundcloud(args[0])
  await conn.sendFile(m.chat, res.url, 'sc.mp3', `🎵 ${res.title}`, m, null, { asDocument: true })
}
handler.help = ['soundcloud <url>']
handler.tags = ['downloader']
handler.command = ['soundcloud', 'sc']
export default handler
