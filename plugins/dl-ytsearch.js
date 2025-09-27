import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { text, conn }) => {
  if (!text) throw `✳️ Tafadhali andika kitu cha kutafuta YouTube`
  let res = await yts(text)
  let teks = res.all.map((v, i) => `
${i + 1}. ${v.title}
🔗 ${v.url}
⏱️ ${v.timestamp} | 📥 ${v.views}
`).join('\n\n')
  m.reply(`≡ *YOUTUBE SEARCH RESULTS*\n\n${teks}`)
}
handler.help = ['ytsearch <query>']
handler.tags = ['downloader']
handler.command = ['ytsearch', 'yts']
export default handler
