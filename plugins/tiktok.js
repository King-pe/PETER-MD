import { tiktokdl } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka link ya TikTok'
  let res = await tiktokdl(args[0])
  let { video } = res
  await conn.sendFile(m.chat, video.no_watermark, 'tiktok.mp4', `🎬 TikTok Downloaded`, m)
}
handler.help = ['tiktok <url>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt']
export default handler
