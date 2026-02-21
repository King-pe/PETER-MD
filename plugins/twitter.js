import { twitterdl } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka link ya Twitter/X'
  let res = await twitterdl(args[0])
  let url = res[0].url
  await conn.sendFile(m.chat, url, 'tw.mp4', `🐦 Twitter Downloaded`, m)
}
handler.help = ['twitter <url>']
handler.tags = ['downloader']
handler.command = ['twitter', 'x']
export default handler
