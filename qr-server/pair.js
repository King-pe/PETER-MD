const { makeid } = require('./id');
const express = require('express');
const fs = require('fs-extra');
const pino = require("pino");
const path = require('path');

let router = express.Router();

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

const PAIR_SUCCESS_MESSAGE = `
╔════◇════════════════════════╗
║  🎉 *PAIR CODE CONNECTED* 🎉
║
║ _Umefaulu kuunganisha kwa pair code!_
║ _Sasa unaweza kuanza kutumia bot._
║
║ 📋 *Hatua Inayofuata:*
║ 1. Nusuru SESSION_ID kutoka ujumbe ujao
║ 2. Tumia SESSION_ID kwenye bot yako
║
║ ⚠️ *MUHIMU:*
║ _Usishare SESSION_ID yako na mtu yeyote!_
║
║ 📞 *Msaada:*
║ Owner: https://wa.me/25567778080
║
╚════════════════════════════╝
`;

const SESSION_ID_HEADER = `
╔════◇════════════════════════╗
║  🔐 *SESSION_ID YAKO* 🔐
║
║ _Hii ni SESSION_ID yako ya kipekee._
║
║ ⚠️ *ONYO LA USALAMA:*
║ • Usishare SESSION_ID hii!
║ • Usiweke kwenye GitHub au mahali ya umma
║
╚════════════════════════════╝

SESSION_ID YAKO:
`;

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function PETER_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'temp', id));

        try {
            let Pair_Code_By_Peter_MD = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Desktop")
            });

            if (!Pair_Code_By_Peter_MD.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Peter_MD.requestPairingCode(num);
                
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Peter_MD.ev.on('creds.update', saveCreds);
            Pair_Code_By_Peter_MD.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    
                    try {
                        const credsFile = path.join(__dirname, 'temp', id, 'creds.json');
                        if (fs.existsSync(credsFile)) {
                            let data = fs.readFileSync(credsFile);
                            await delay(800);
                            let b64data = Buffer.from(data).toString('base64');
                            let sessionId = "PETER-MD;;;" + b64data;

                            let session = await Pair_Code_By_Peter_MD.sendMessage(Pair_Code_By_Peter_MD.user.id, { text: PAIR_SUCCESS_MESSAGE });
                            await delay(2000);
                            await Pair_Code_By_Peter_MD.sendMessage(Pair_Code_By_Peter_MD.user.id, { text: SESSION_ID_HEADER + sessionId }, { quoted: session });
                        }
                    } catch (err) {
                        console.error("Session Send Error:", err);
                    }

                    await delay(100);
                    await Pair_Code_By_Peter_MD.ws.close();
                    return await removeFile(path.join(__dirname, 'temp', id));
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    PETER_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.error("Pair Code Error:", err);
            await removeFile(path.join(__dirname, 'temp', id));
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await PETER_MD_PAIR_CODE();
});

module.exports = router;
