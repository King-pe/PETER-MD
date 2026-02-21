import { instagramdl } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka link ya Instagram'
  let res = await instagramdl(args[0])
  for (let v of res) {
    await conn.sendFile(m.chat, v.url, 'ig.mp4', `📷 Instagram Downloaded`, m)
  }
}
handler.help = ['instagram <url>']
handler.tags = ['downloader']
handler.command = ['instagram', 'ig']
export default handler
