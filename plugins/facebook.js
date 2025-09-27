import { facebookdl } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka link ya Facebook'
  let res = await facebookdl(args[0])
  let url = res[0].url
  await conn.sendFile(m.chat, url, 'fb.mp4', `📘 Facebook Downloaded`, m)
}
handler.help = ['facebook <url>']
handler.tags = ['downloader']
handler.command = ['facebook', 'fb']
export default handler
