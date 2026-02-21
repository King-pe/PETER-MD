//#ENJOY
const fs = require("fs-extra");
if (fs.existsSync(".env"))
  require("dotenv").config({ path: __dirname + "/.env" });
global.audio = "https://od.lk/d/NzhfNTk5OTc4MjVf/Mrsky.mp3";
global.video = "";
global.port = process.env.PORT;
global.appUrl = process.env.APP_URL || "";
global.email = "ptechtanzania015@gmail.com";
global.location = "Iringa,Tanzania.";
global.mongodb = process.env.MONGODB_URI || "mongodb+srv://KING-MDBOT:KING-MDBOT@cluster0.ltjjfkx.mongodb.net/?retryWrites=true&w=majority";
global.allowJids = process.env.ALLOW_JID || "null";
global.blockJids = process.env.BLOCK_JID || "null";
global.DATABASE_URL = process.env.DATABASE_URL || "";
global.timezone = process.env.TZ || process.env.TIME_ZONE || "Africa/Dar es salaam";
global.github = process.env.GITHUB || "https://github.com/King-pe/PETER-md";
global.gurl = process.env.GURL || "https://chat.whatsapp.com/I98ptwPbiFd7CvHXtcJMxp";
global.website = process.env.GURL || "https://chat.whatsapp.com/I98ptwPbiFd7CvHXtcJMxp";
global.THUMB_IMAGE = process.env.THUMB_IMAGE || process.env.IMAGE || "https://telegra.ph/file/504b26be1bb9cf690261b.jpg";
global.devs = "255715654328";
global.sudo = process.env.SUDO || "255682211773";
global.owner = process.env.OWNER_NUMBER || "255682211773";
global.style = process.env.STYLE || "3";
global.gdbye = process.env.GOODBYE || "false";
global.wlcm = process.env.WELCOME || "false";
global.warncount = process.env.WARN_COUNT || 3;
global.disablepm = process.env.DISABLE_PM || "false";
global.disablegroup = process.env.DISABLE_GROUPS || "false";
global.MsgsInLog = process.env.MSGS_IN_LOG || "true";
global.userImages = process.env.USER_IMAGES || "";
global.waPresence = process.env.WAPRESENCE || "online";
global.readcmds = process.env.READ_COMMAND || "false";
global.readmessage = process.env.READ_MESSAGE || "false";
global.readmessagefrom = process.env.READ_MESSAGE_FROM || "";
global.read_status = process.env.AUTO_READ_STATUS || "true";
global.save_status = process.env.AUTO_SAVE_STATUS || "false";
global.save_status_from = process.env.SAVE_STATUS_FROM || "";
global.read_status_from = process.env.READ_STATUS_FROM || "";

global.api_smd = "https://api-smd-1.vercel.app";
global.scan = "http://peter-md.lovestoblog.com";

global.SESSION_ID =
  process.env.SESSION_ID ||
  "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUdHMFRwTktDOUhaYnpvc1VaakRmY1RWaXdLUHRadnNEdVRCTkMwZ0tYTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibEdjNDNzekY0VUl6eTNULzFmbGRxQVgxZHFEZUVNZGhQZ1FYcU9nSDBETT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlRGc5eHEyVnNrdE9KTERUbkpsZ281UDZSZjU1UnZMUlE3QlpqbTJDUUhFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXR1BDOHVCRGk0UHNVOHBwcEJyOGRCTmxpWFF0cXE3dm9pbnB5bG94QmdzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1LL212dW5PVDRKdzVxRXUvZjNoM3A2ZWNpZkNmTDBnTmxGTmpLUzZHRzA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlTcE1ESHk1M2FId3hJaTgyNUtmM1JESm92S1N0cEpXOFdnTHlRMWorbjQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieU15Rm9VdXdjcjNHajE3dzk3cUVvWUtOZkxQNzZrTkFleEpJelNLYk8zYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU1M3RnV6OEUxRnRkZ2tISWszYVNUdGpkcytNeERnQytMZlVqbVdPSFNuQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im5tazB4UWlxNklQeS8xWGpRMHQ5aThUT0ZKMDNqVFNiMXAyall6YTIwNHh6dDM0TEdDK3kwb0lBU1VQejhSQjdiM0ltL3VkdEtNTGpzWWVwNFpRaEN3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzUsImFkdlNlY3JldEtleSI6ImxwVnBkb2NYNldzdkRldzhsWWEvNmNCRjJZYXFTYnYvNUhSWWc2a2VOSnM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjU1NjgyMjExNzczQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDMTkyMzI0NTFBODYxQzNFRDU4OEI5MTU4Nzc1N0IyIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NzE2OTEzNzV9XSwibmV4dFByZUtleUlkIjo2MSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjYxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IkhvZ1BOb0E5UkVLYlpnUEFaQzlhZXciLCJwaG9uZUlkIjoiZjYxYzUzZmUtNDNlZS00ZjIyLTlmMWMtZWUwZjkyMjU3MTA3IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1JTTU4QnZrSk1HQS9IQS9zT3dlbEIwdmsxUT0ifSwicmVnaXN0ZXJlZCI6ZmFsc2UsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSkRyYXRTY0VaT3BQS1BpbHJPcEdoRVV3UzN3PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT0cvZ2ZvSEVPaTY1OHdHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiendlcmlDRnNOa3RpVHB4S21YbkFsdlFhT0xGSVlJMTBPazY1VXUzeFhqdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiS0JJK01URXRDSzRGZTdlNVcwSTdscDMxNGFLZ1oyTGxvcDNTb1VabmpQMnVHU3ZtZFkxR2R6czJwRlIzYTVNcVFoOGxlcEF4YnRqc2ZxalpubHp0QXc9PSIsImRldmljZVNpZ25hdHVyZSI6IlRxdE5hcFhDSElkVmJsVm5PRHR4Q2NyUWRvTkNwbjVHS0VxNldoUnBTUUQ0K21PTHg5N3hnUXFsSE1lb0dKbTJXK1dtYTFqMlZuelFMdUdEVWVUY0R3PT0ifSwibWUiOnsiaWQiOiIyNTU2ODIyMTE3NzM6NjFAcy53aGF0c2FwcC5uZXQifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NjgyMjExNzczOjYxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmM4SHE0Z2hiRFpMWWs2Y1NwbDV3SmIwR2ppeFNHQ05kRHBPdVZMdDhWNDgifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NzE2OTEzNzMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQk14In0="
module.exports = {
  menu: process.env.MENU || "",
  HANDLERS: process.env.PREFIX || "m",
  BRANCH: process.env.BRANCH || "main",
  VERSION: process.env.VERSION || "1.0.0",
  caption: process.env.CAPTION || " _PETER-MD-Whatsapp-Bot_ ",
  author: process.env.PACK_AUTHER || "PETER",
  packname: process.env.PACK_NAME || "♥️",
  botname: process.env.BOT_NAME || "PETER-MD",
  ownername: process.env.OWNER_NAME || "PETER",
  errorChat: process.env.ERROR_CHAT || "",
  KOYEB_API: process.env.KOYEB_API || "false",
  REMOVE_BG_KEY: process.env.REMOVE_BG_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  antilink_values: process.env.ANTILINK_VALUES || "http://,www.goog.com,https://,https://chat.whatsapp.com/,wa.me/,https://cutt.ly/,",
  HEROKU: process.env.HEROKU_APP_NAME && process.env.HEROKU_API_KEY,
  aitts_Voice_Id: process.env.AITTS_ID || "37",
  ELEVENLAB_API_KEY: process.env.ELEVENLAB_API_KEY || "",
  WORKTYPE: process.env.WORKTYPE || process.env.MODE || "public",
  LANG: (process.env.THEME || "PETER").toUpperCase(),
};
global.rank = "updated";
global.isMongodb = false;
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update'${__filename}'`);
  delete require.cache[file];
  require(file);
});
