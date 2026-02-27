const fs = require("fs");
const path = require("path");
const Config = require("./config.js");
const blockJid = ["" + (process.env.BLOCKJIDS || "120363023983262391@g.us"), ...(typeof global.blockJids === "string" ? global.blockJids.split(",") : [])];
const allowJid = ["null", ...(typeof global.allowJids === "string" ? global.allowJids.split(",") : [])];
const Pino = require("pino");
const {
  Boom
} = require("@hapi/boom");
const FileType = require("file-type");
const express = require("express");
const app = express();
const events = require("./plugins");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require("./exif");
let {
  default: SuhailMDConnect,
  proto,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  DisconnectReason,
  useMultiFileAuthState,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  makeInMemoryStore,
  jidDecode
} = require("@whiskeysockets/baileys");
var last_status = {};
global.setCmdAlias = {};
global.AstroOfficial = false;
global.sqldb = false;
global.pg_pools = false;
const {
  userdb,
  sck,
  groupdb,
  Plugindb,
  bot_,
  smdBuffer
} = require("../lib");
const fetch = require("node-fetch");
const axios = require("axios");
let {
  sleep,
  getBuffer,
  parsedJid,
  tiny,
  botpic,
  tlang
} = require("../lib");
const {
  smsg,
  callsg,
  groupsg,
} = require("./serialized.js");
const {
  runtime,
  getSizeMedia,
} = require("../lib");
var prefa = !Config.HANDLERS || ["false", "null", " ", "", "nothing", "not", "empty"].includes(!Config.HANDLERS) ? true : false;
global.prefix = prefa ? "" : Config.HANDLERS[0];
global.prefixRegex = prefa || ["all"].includes(Config.HANDLERS) ? new RegExp("^") : new RegExp("^[" + Config.HANDLERS + "]");
global.prefixboth = ["all"].includes(Config.HANDLERS);
let baileys = "/Sessions/";
const connnectpg = async () => {
  try {
    const {
      Pool: _0x49bfec
    } = require("pg");
    const _0x39ea68 = new _0x49bfec({
      connectionString: global.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    const _0xbc8be7 = await _0x39ea68.connect();
    _0xbc8be7.release();
    console.log("🌍 Connected to the PostgreSQL.");
    return true;
  } catch (_0x4fb407) {
    console.log("Could not connect with PostgreSQL.\n");
    return false;
  }
};
const connnectMongo = async () => {
  const _0x1268d = require("mongoose");
  try {
    _0x1268d.set("strictQuery", true);
    await _0x1268d.connect(mongodb);
    console.log("🌍 Connected to the Mongodb.");
    return true;
  } catch {
    console.log("Could not connect with Mongodb.");
    return false;
  }
};
let Suhail = {};
const store = makeInMemoryStore({
  logger: Pino({
    level: "silent"
  }).child({
    level: "silent"
  })
});
try {
  if (fs.existsSync(__dirname + "/store.json")) {
    store.readFromFile(__dirname + "/store.json");
  }
} catch (_0x4ef18e) {
  console.log("CLIENT STORE ERROR:\n", _0x4ef18e);
}
require("events").EventEmitter.defaultMaxListeners = 2000;
async function syncdb() {
  let _0x3d0468 = __dirname + "/assets/logo.png";
  try {
    global.log0 = typeof THUMB_IMAGE === "string" ? await getBuffer(THUMB_IMAGE.split(",")[0]) : fs.readFileSync(_0x3d0468);
  } catch (_0x780452) {
    _0x3d0468 = __dirname + "/assets/logo.png";
  }
  global.log0 = global.log0 || fs.readFileSync(_0x3d0468);
  const {
    state: _0x46b7e4,
    saveCreds: _0xd884d9
  } = await useMultiFileAuthState(__dirname + baileys);
  let _0x5447f8 = SuhailMDConnect({
    logger: Pino({
      level: "silent" || "debug" || "fatal"
    }),
    printQRInTerminal: false,
    browser: ["Windows", "chrome", ""],
    fireInitQueries: true,
    shouldSyncHistoryMessage: true,
    downloadHistory: true,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
    auth: _0x46b7e4,
    getMessage: async _0x303f46 => {
      let _0x2faf9d = {
        conversation: "WASI-Md"
      };
      if (store) {
        const _0x27b3c1 = await store.loadMessage(_0x303f46.remoteJid, _0x303f46.id);
        return _0x27b3c1.message || _0x2faf9d;
      }
      return _0x2faf9d;
    }
  });
  store.bind(_0x5447f8.ev);
  setInterval(() => {
    try {
      store.writeToFile(__dirname + "/store.json");
    } catch (_0x54ac48) {
      console.log("CLIENT STORE ERROR:\n", _0x54ac48);
    }
  }, 10000);
  _0x5447f8.ev.on("call", async _0x522b10 => {
    let _0x37f540 = await callsg(_0x5447f8, JSON.parse(JSON.stringify(_0x522b10[0])));
    events.commands.map(async _0x13c575 => {
      if (_0x13c575.call === "offer" && _0x37f540.status === "offer") {
        try {
          _0x13c575.function(_0x37f540, {
            store: store,
            Void: _0x5447f8
          });
        } catch (_0x557640) {
          console.error("[CALL ERROR] ", _0x557640);
        }
      }
      if (_0x13c575.call === "accept" && _0x37f540.status === "accept") {
        try {
          _0x13c575.function(_0x37f540, {
            store: store,
            Void: _0x5447f8
          });
        } catch (_0x3d8400) {
          console.error("[CALL ACCEPT ERROR] ", _0x3d8400);
        }
      }
      if (_0x13c575.call === "call" || _0x13c575.call === "on" || _0x13c575.call === "all") {
        try {
          _0x13c575.function(_0x37f540, {
            store: store,
            Void: _0x5447f8
          });
        } catch (_0x27942e) {
          console.error("[CALL ERROR] ", _0x27942e);
        }
      }
    });
  });
  var _0x5b55c3 = false;
  let _0x4f1890 = {};
  let _0x686f61 = {};
  _0x5447f8.ev.on("messages.upsert", async _0x21c265 => {
    try {
      if (!_0x21c265.messages || !Array.isArray(_0x21c265.messages)) {
        return;
      }
      _0x5b55c3 = _0x5b55c3 || _0x5447f8.decodeJid(_0x5447f8.user.id);
      for (mek of _0x21c265.messages) {
        mek.message = Object.keys(mek.message || {})[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;
        if (!mek.message || !mek.key || !/broadcast/gi.test(mek.key.remoteJid)) {
          continue;
        }
        let _0x4857e4 = await smsg(_0x5447f8, JSON.parse(JSON.stringify(mek)), store, true);
        if (!_0x4857e4.message) {
          continue;
        }
        let _0x40f6ef = _0x4857e4.body;
        let _0x12bfa9 = {
          body: _0x40f6ef,
          mek: mek,
          text: _0x40f6ef,
          args: _0x40f6ef.split(" ") || [],
          botNumber: _0x5b55c3,
          isCreator: _0x4857e4.isCreator,
          store: store,
          budy: _0x40f6ef,
          Suhail: {
            bot: _0x5447f8
          },
          Void: _0x5447f8,
          proto: proto
        };
        events.commands.map(async _0x2becac => {
          if (typeof _0x2becac.on === "string") {
            let _0x443fbc = _0x2becac.on.trim();
            let _0x17b495 = !_0x2becac.fromMe || _0x2becac.fromMe && _0x4857e4.fromMe;
            if (/status|story/gi.test(_0x443fbc) && (_0x4857e4.jid === "status@broadcast" || mek.key.remoteJid === "status@broadcast") && _0x17b495) {
              _0x2becac.function(_0x4857e4, _0x40f6ef, _0x12bfa9);
            } else if (["broadcast"].includes(_0x443fbc) && (/broadcast/gi.test(mek.key.remoteJid) || _0x4857e4.broadcast || /broadcast/gi.test(_0x4857e4.from)) && _0x17b495) {
              _0x2becac.function(_0x4857e4, _0x40f6ef, _0x12bfa9);
            }
          }
        });
      }
    } catch (_0x45f1be) {
      console.log("ERROR broadCast --------- messages.upsert \n", _0x45f1be);
    }
  });
  _0x5447f8.ev.on("messages.upsert", async _0x1071af => {
    try {
      _0x5b55c3 = _0x5b55c3 || _0x5447f8.decodeJid(_0x5447f8.user.id);
      if (!global.isStart) {
        return;
      }
      for (mek of _0x1071af.messages) {
        if (!mek.message) {
          continue;
        }
        mek.message = Object.keys(mek.message || {})[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;
        if (!mek.message || !mek.key || /broadcast/gi.test(mek.key.remoteJid)) {
          continue;
        }
        let _0x5979da = await smsg(_0x5447f8, JSON.parse(JSON.stringify(mek)), store, true);
        let _0x11d09c = _0x5979da;
        if (!_0x5979da.message || _0x5979da.chat.endsWith("broadcast")) {
          continue;
        }
        var {
          body: _0x4186a0
        } = _0x5979da;
        var _0x36ea81 = _0x5979da.isCreator;
        var _0x57832c = typeof _0x5979da.text == "string" ? _0x5979da.text.trim() : false;
        if (_0x57832c && _0x4186a0[1] && _0x4186a0[1] == " ") {
          _0x4186a0 = _0x4186a0[0] + _0x4186a0.slice(2);
        }
        let _0x9954f4 = false;
        let _0x4931af = false;
        let _0x49f69c = false;
        if (_0x57832c && Config.HANDLERS.toLowerCase().includes("null")) {
          _0x9954f4 = true;
          _0x4931af = _0x4186a0.split(" ")[0].toLowerCase() || false;
        } else if (_0x57832c && !Config.HANDLERS.toLowerCase().includes("null")) {
          _0x9954f4 = prefixboth || _0x4186a0 && prefixRegex.test(_0x4186a0[0]) || _0x5979da.isAstro && /2348039607375|2349027862116|2348052944641/g.test(_0x5b55c3) && _0x4186a0[0] == ",";
          _0x4931af = _0x9954f4 ? prefa ? _0x4186a0.trim().split(" ")[0].toLowerCase() : _0x4186a0.slice(1).trim().split(" ")[0].toLowerCase() : false;
          _0x49f69c = prefixboth ? _0x4186a0.trim().split(" ")[0].toLowerCase() : "";
        } else {
          _0x9954f4 = false;
        }
        let _0x4dc849 = _0x4931af ? _0x4931af.trim() : "";
        if (_0x4dc849 && global.setCmdAlias[_0x4dc849] !== undefined) {
          _0x4931af = global.setCmdAlias[_0x4dc849];
          _0x9954f4 = true;
        } else if (_0x5979da.mtype == "stickerMessage") {
          _0x4dc849 = "sticker-" + _0x5979da.msg.fileSha256;
          if (global.setCmdAlias[_0x4dc849]) {
            _0x4931af = global.setCmdAlias[_0x4dc849];
            _0x9954f4 = true;
          }
        }
        if (blockJid.includes(_0x5979da.chat) && !_0x5979da.isAstro) {
          return;
        }
        if (_0x9954f4 && (_0x5979da.isBaileys || !_0x36ea81 && Config.WORKTYPE === "private" && !allowJid.includes(_0x5979da.chat))) {
          _0x9954f4 = false;
        }
        const _0x34cf4e = _0x5979da.body ? _0x4186a0.trim().split(/ +/).slice(1) : [];
        if (!_0x36ea81 && global.disablepm === "true" && _0x9954f4 && !_0x5979da.isGroup) {
          _0x9954f4 = false;
        }
        if (!_0x36ea81 && global.disablegroup === "true" && _0x9954f4 && _0x5979da.isGroup && !allowJid.includes(_0x5979da.chat)) {
          _0x9954f4 = false;
        }
        Suhail.bot = _0x5447f8;
        if (_0x9954f4) {
          let _0x111ae6 = events.commands.find(_0x3350ce => _0x3350ce.pattern === _0x4931af) || events.commands.find(_0x33eb5e => _0x33eb5e.alias && _0x33eb5e.alias.includes(_0x4931af));
          if (!_0x111ae6 && prefixboth && _0x49f69c) {
            _0x111ae6 = events.commands.find(_0x4c60c8 => _0x4c60c8.pattern === _0x49f69c) || events.commands.find(_0x4a2be0 => _0x4a2be0.alias && _0x4a2be0.alias.includes(_0x49f69c));
          }
          if (_0x111ae6 && _0x111ae6.fromMe && !_0x5979da.fromMe && !_0x36ea81) {
            _0x111ae6 = false;
            return _0x5979da.reply(tlang().owner);
          }
          if (_0x5979da.isGroup && _0x111ae6 && _0x4931af !== "bot") {
            let _0x334235 = _0x4f1890[_0x5979da.chat] || (await groupdb.findOne({
              id: _0x5979da.chat
            })) || {
              botenable: toBool(_0x5979da.isAstro || !blockJid.includes(_0x5979da.chat))
            };
            if (_0x334235 && _0x334235.botenable === "false") {
              _0x111ae6 = false;
            }
            if (_0x111ae6 && _0x334235) {
              let _0x262020 = _0x111ae6.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              let _0x1678dd = new RegExp("\\b" + _0x262020 + "\\b");
              if (_0x334235.disablecmds !== "false" && _0x1678dd.test(_0x334235.disablecmds)) {
                _0x111ae6 = false;
              }
            }
          }
          if (!_0x36ea81 && _0x111ae6) {
            try {
              let _0x129db8 = _0x686f61[_0x5979da.sender] || (await userdb.findOne({
                id: _0x5979da.sender
              })) || {
                ban: "false"
              };
              if (_0x129db8.ban === "true") {
                _0x111ae6 = false;
                _0x5979da.reply("*Hey " + _0x5979da.senderName.split("\n").join("  ") + ",*\n_You are banned from using commands._");
              }
            } catch (_0x1ae665) {
              console.log("checkban.ban", _0x1ae665);
            }
          }
          if (_0x111ae6) {
            if (_0x111ae6.react) {
              _0x5979da.react(_0x111ae6.react);
            }
            let _0x23f471 = _0x5979da.body ? _0x4186a0.trim().split(/ +/).slice(1).join(" ") : "";
            let _0x2e97d6 = _0x111ae6.pattern;
            _0x5979da.cmd = _0x2e97d6;
            try {
              _0x111ae6.function(_0x5979da, _0x23f471, {
                cmd: _0x2e97d6,
                text: _0x23f471,
                body: _0x4186a0,
                args: _0x34cf4e,
                cmdName: _0x4931af,
                isCreator: _0x36ea81,
                smd: _0x2e97d6,
                botNumber: _0x5b55c3,
                budy: _0x57832c,
                store: store,
                Suhail: Suhail,
                Void: _0x5447f8
              });
            } catch (_0x1db755) {
              console.log("[ERROR] ", _0x1db755);
            }
          } else {
            _0x9954f4 = false;
            const _0x44e2a2 = events.commands.find(_0x527670 => _0x527670.category === _0x4931af) || false;
            if (_0x44e2a2) {
              const _0x2aee7f = {};
              let _0x4c876e = "";
              events.commands.map(async (_0x2d64f9, _0x30758e) => {
                if (_0x2d64f9.dontAddCommandList === false && _0x2d64f9.pattern !== undefined) {
                  if (!_0x2aee7f[_0x2d64f9.category]) {
                    _0x2aee7f[_0x2d64f9.category] = [];
                  }
                  _0x2aee7f[_0x2d64f9.category].push(_0x2d64f9.pattern);
                }
              });
              for (const _0x47f295 in _0x2aee7f) {
                if (_0x4931af == _0x47f295.toLowerCase()) {
                  _0x4c876e = "┌───〈 🌹*" + _0x47f295.toLowerCase() + " menu*🌹  〉───◆\n│╭─────────────···▸\n┴│▸\n";
                  for (const _0x562a5a of _0x2aee7f[_0x47f295]) {
                    _0x4c876e += "⬡│▸ " + _0x562a5a + "\n";
                  }
                  _0x4c876e += "┬│▸\n│╰────────────···▸▸\n└───────────────···▸";
                  break;
                }
              }
              _0x5447f8.sendUi(_0x5979da.jid, {
                caption: tiny(_0x4c876e)
              });
            }
          }
        }
        try {
          _0x4f1890[_0x5979da.chat] = (await groupdb.findOne({
            id: _0x5979da.chat
          })) || (await groupdb.new({
            id: _0x5979da.chat,
            botenable: _0x5979da.chat === "120363023983262391@g.us" ? "false" : "true",
            goodbye: toBool(global.gdbye),
            welcome: toBool(global.wlcm)
          }));
          _0x686f61[_0x5979da.sender] = (await userdb.findOne({
            id: _0x5979da.sender
          })) || (await userdb.new({
            id: _0x5979da.sender,
            name: _0x5979da.pushName || "Unknown"
          }));
        } catch (_0x1e1681) {
          main();
        }
        text = _0x5979da.body;
        let _0x4717ae = {
          dbuser: _0x686f61[_0x5979da.sender],
          dbgroup: _0x4f1890[_0x5979da.chat],
          body: _0x4186a0,
          mek: mek,
          text: text,
          args: _0x34cf4e,
          botNumber: _0x5b55c3,
          isCreator: _0x36ea81,
          icmd: _0x9954f4,
          store: store,
          budy: _0x57832c,
          Suhail: Suhail,
          Void: _0x5447f8,
          proto: proto
        };
        let _0x1421b9 = {
          mp4: "video",
          mp3: "audio",
          webp: "sticker",
          photo: "image",
          picture: "image",
          vv: "viewonce"
        };
        events.commands.map(async _0x2dffdb => {
          if (typeof _0x2dffdb.on === "string") {
  
(Content truncated due to size limit. Use line ranges to read remaining content)