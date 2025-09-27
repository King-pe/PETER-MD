import fetch from 'node-fetch'
import { apkpure } from '@bochilteam/scraper'

let handler = async (m, { args, conn }) => {
  if (!args[0]) throw '✳️ Weka jina la app (mfano: whatsapp)'
  let res = await apkpure(args[0])
  let { title, size, dl_url } = res[0]
  await conn.sendFile(m.chat, dl_url, `${title}.apk`, `📱 ${title}\n📦 Size: ${size}`, m)
}
handler.help = ['apk <appname>']
handler.tags = ['downloader']
handler.command = ['apk', 'apkpure']
export default handler
