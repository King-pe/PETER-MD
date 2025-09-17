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
  "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0Y3cWJtVGI3alRyREZDeU9Mcy9WR3FDdEZRQi9jQk5FcVRUZldKM2puRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZE1zeHZZSVFhVlhBdDZYMmFrbzNuV09wR2lBWXJKUnhpeTRtbnYyZDJTVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpQWJabGRFSFFrcldNUnZEMFVuejNWTmFMV1lhN1hiYnppZ05GUGN6em5ZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJUdHc3U3p6S2xQb1NCazRVaG5lNFlkTC90Y1VxQ1dPZkRZcE1nQlkvTFVvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndGdmZyMW9uaWFCWnowTFgwTUF5Y2Z1eC9VaHRLVEx0a01aQkJlbHRNVVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjdzRVduZFR1MkhPcDZKWmdZUUJKaTA0QTl6djlFelBqOUZNMkFhc2hHSFE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUhKclpxYzRpRXFrUGUrNDVxcm1NYnBuMjhtbUtzK0ljci9tQUQwcGVYcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTXVWd25yeGJhY0tudm1nOXFxK3k0UE5xUW1tNVpiVGNGRFh4aDRsV0h3Zz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjRtK0w2R20vOEVsZTAwZjkwTjR5MjlVaHRyS3FjNWY2a1FqWEdDMnVsTVE3VkF1c3BUQVRDVEJFTis4K3BzVkRUcmhKWXJvR2lwRjB5d0dYdm42MkRnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MSwiYWR2U2VjcmV0S2V5IjoiNmtUQktjSU03emhqMnpCWUNKQ2tiQVY3SFFtV3EyWGJBYyt5ei93WHlJcz0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOltdLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoicGY0blZpT0ZUR1cyV08xODBmeFBTUSIsInBob25lSWQiOiI2YWI1ZDg0NC05YjA3LTQwMWItODlmMS05MGRiNjc3NjQyMzEiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVjRjbFhuWnpKK2V6MEtncDN5aktZSXNUUGZjPSJ9LCJyZWdpc3RlcmVkIjpmYWxzZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1RUtnZXZVblg3SmozVHpSemtQb0pjK3cwWTA9In0sInJlZ2lzdHJhdGlvbiI6e30sImFjY291bnQiOnsiZGV0YWlscyI6IkNLQ1huYUlIRU1DM3FzWUdHQU1nQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJtT0h4dm9vbkdtaHVoeUMwdmMyQmlYaURHSTVxVk8xMlozOWFER05pd2hRPSIsImFjY291bnRTaWduYXR1cmUiOiIxajh4OHE3bmgwbHJZQ3MxTEpZdmh0TkJ6Q2RCaFhnbGdWOXhpNllqNm5TSXJIVG10SURMZnFFZ1dnYTBXTUdyRDYzMENXczZhbGEvdEx6TGZ2aHpBZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoib3lmMVRYdW9kUkRuaGpGdVF5Zk9tL0EwMHdLaGFxTHlZblhYc2ZJdVJ5VHlpT3dRQzNxUWZmVWRIdnNoVktKdG9yNUhGa3A2T0x6bC9vRXpyT0QvQnc9PSJ9LCJtZSI6eyJpZCI6IjI1NTY4MjIxMTc3MzoyOUBzLndoYXRzYXBwLm5ldCJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTU2ODIyMTE3NzM6MjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCWmpoOGI2S0p4cG9ib2NndEwzTmdZbDRneGlPYWxUdGRtZC9XZ3hqWXNJVSJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1ODEwODYxNH0="
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
