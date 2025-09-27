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
global.disablegroup = process.env.DISABLE_GROUPS || "false",
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
  "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUZkZWFRRVZ2dEl1MU5EUENybUlxQVlKaDkvcDMzVmpQSnhzT3p5NmRrWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZFprdk9uSnZlQjd5VDQ1VktWUDVtcmNiM05wanN2dmtwU29QSUJXUk1Vbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvQ0VVN1doZ0k3UGRia0Nyd1RyREp2MW8xMkZkeG92S25YMDBpVnRWcEVrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ2R2hjdkdTK21vSmZ5djNrNWlsR3dDQnFvcHFCQ3A1VmhQZEJBcmIycHc0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVETE1VQUp3ZXlhOUhuek5EVzhQMVRLV0FjWVBFN3dXUDUzMXFmRzMyazg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRteU5sRVRlSXQ3RmdIYmJZUWdWdDZ2ZG0zQXd4MVNpbFZjdWJCRW0rZzg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkoyY3V3QWh4cHdQOHdmZ21DcFNDdllybFZUL0dyZEZpMzFnRG1GR2JXQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiME1nSGpnODQ2M0hIMmFyMTJVVmZ2aWplVDB5VFc0eStITmtXNVBMNVdGWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9RQ3cxdUlNUGFjRytXSU5RS0JURTdTajFlZUY0ZGdIZHRnSWl0RGpjQ1hQRE4waC9DMDhpTExxV3dVVkZkV3VEcTNqSWl2ODRSdzhicjBrRGwzY2hBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzgsImFkdlNlY3JldEtleSI6InI2cTM4KzB5WGNESlF3dmlSQnlKSkRkZEQxeXozVWVFZTJxcDJFeFRvbFU9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IjFXeEMteXhoVE5TRVk3TVRHaTRtYWciLCJwaG9uZUlkIjoiYTkwNzZhNWItNjZiOC00NDI1LWE1NTItZTE0Njc1NmYzOTZiIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Imx3QWxBdzNHZkQ5YWtsUkNWR0dvY1Z2ODNSMD0ifSwicmVnaXN0ZXJlZCI6ZmFsc2UsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUzJXZEsrRTBjb3NXZFNpRWFlWDZLRzdocFdrPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS0NYbmFJSEVPeTMzOFlHR0FvZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoibU9IeHZvb25HbWh1aHlDMHZjMkJpWGlER0k1cVZPMTJaMzlhREdOaXdoUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoielgrODJCaXFhV2pwa0NFeUpWUEtGbll6UmI0VVRhNk5hUTR6aTAxUGEvUWFMKzBRN0FocE1wajIyUktsakdUVVFSRURpK29FOXZ5OGVuaXhnekppQXc9PSIsImRldmljZVNpZ25hdHVyZSI6IndzdnIxRGgzbkxFMjlDbzVMR0ZHWEpMcmpYMEN0OGZuSitSYWhMSk5FS2tVYmZNNFpOSDE0ZTdsR0o4MENRa3d5cWliS2xOb2ZXNlVCNDduekowWWp3PT0ifSwibWUiOnsiaWQiOiIyNTU2ODIyMTE3NzM6MzFAcy53aGF0c2FwcC5uZXQifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NjgyMjExNzczOjMxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlpqaDhiNktKeHBvYm9jZ3RMM05nWWw0Z3hpT2FsVHRkbWQvV2d4allzSVUifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTg5NzcwMTJ9="
module.exports = {
  menu: process.env.MENU || "",
  HANDLERS: process.env.PREFIX || ".",
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
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "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",
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
