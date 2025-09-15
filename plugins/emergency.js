const { smd, prefix } = require("../lib");

function buildEmergency(owner = "") {
  return (
    "Hatua za dharura kwa simu iliyopotea/kuibwa:\n\n" +
    "1) Wasiliana na mtandao wa simu wako (carrier) na toa IMEI.\n" +
    "2) Funga SIM (au fanya SIM swap).\n" +
    "3) Tumia huduma rasmi za kufuatilia: \n   - Android: https://google.com/android/find\n   - iPhone: https://www.icloud.com/find\n" +
    "4) Badilisha nywila na washa 2FA (Google/Apple/WhatsApp n.k.).\n" +
    "5) Ondoa vifaa visivyotambulika (WhatsApp Web/Google/iCloud).\n\n" +
    (owner ? `Msaada zaidi: wasiliana na ${owner}\n` : "")
  );
}

smd({
  pattern: "emergency",
  desc: "Mwongozo wa haraka wa simu iliyopotea",
  category: "security",
  filename: __filename,
}, async (m) => {
  try {
    const { Config } = require("../lib");
    const guide = buildEmergency(Config.ownername || "");
    await m.send(guide);
  } catch (e) {
    await m.error(e + "\n\ncommand: emergency", e);
  }
});

smd({
  pattern: "lostphone",
  desc: "Linki za Find My Device/iPhone",
  category: "security",
  filename: __filename,
}, async (m) => {
  try {
    const msg = (
      "Find My Device links:\n\n" +
      "- Android: https://google.com/android/find\n" +
      "- iPhone: https://www.icloud.com/find\n\n" +
      `Tumia pia: ${prefix}emergency kwa maelekezo ya haraka`
    );
    await m.send(msg);
  } catch (e) {
    await m.error(e + "\n\ncommand: lostphone", e);
  }
});

smd({
  pattern: "alert",
  desc: "Tuma ujumbe wa onyo kwa namba ulizotaja (comma separated)",
  category: "security",
  filename: __filename,
  use: "alert 2557xxxxxxx,2556xxxxxxx|Ujumbe wako",
}, async (m, text) => {
  try {
    const raw = (text || m.reply_text || "").trim();
    const idx = raw.indexOf("|");
    if (idx === -1) {
      return m.reply("Mfano: .alert 255700000001,255700000002|Simu yangu imepotea, tafadhali usijibu meseji za ajabu kutoka namba yangu.");
    }
    const list = raw.slice(0, idx).split(",").map((s) => s.trim()).filter(Boolean);
    const body = raw.slice(idx + 1).trim();
    if (!list.length || !body) return m.reply("Weka namba na ujumbe: 2557..,2556..|Ujumbe");
    for (const num of list) {
      const jid = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await m.bot.sendMessage(jid, { text: body });
      await m.sleep(500);
    }
    await m.reply("Alert imetumwa kwa namba ulizochagua.");
  } catch (e) {
    await m.error(e + "\n\ncommand: alert", e);
  }
});


