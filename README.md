# Peter-MD WhatsApp Bot (Baileys)

WhatsApp Bot yenye mifumo ya **Group Management**, **Auto-React**, na **Status Auto-View/Comment**.

## BOT REQUIREMENTS:
1. **Pairing**: QR itatokea kwenye logs za Render au Terminal.
2. **Session Persistence**: Inatumia MongoDB.
3. **Prefix System**: Prefix ni `.` (inaweza kubadilishwa kwenye .env).
4. **Group Management**: `.kick`, `.add`, `.promote`, `.demote`, `.open`, `.close`, n.k.
5. **React System**: `.react on/off` - Bot ina-react ❤️ kwenye kila message.
6. **Status System**: `.statusview on/off`, `.statuscomment on/off`, `.setstatusreply text`.

## RENDER DEPLOYMENT STEPS:
1. **Fork au Push** code hii kwenye GitHub yako.
2. Nenda [Render.com](https://render.com) na ufungue **New Web Service**.
3. Unganisha repository yako ya GitHub.
4. Tumia mipangilio ifuatayo:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Ongeza **Environment Variables**:
   - `MONGODB_URI`: Link ya database yako ya MongoDB Atlas.
   - `OWNER_NUMBER`: Namba yako ya simu (mfano: `255682211773`).
   - `PREFIX`: `.`
   - `PORT`: `3000`
6. Baada ya kudeploy, angalia **Logs** ili uweze kuscan QR code.
7. **Kama QR inakataa (Mboni inagoma)**: Ongeza variable ya `PAIRING_NUMBER` (mfano: `255682211773`) na utapata kodi ya tarakimu 8 kwenye logs au kwa kufungua link ya bot yako (`/qr`). Ingiza kodi hiyo kwenye WhatsApp > Linked Devices > Link with phone number instead.

## COMMANDS:
- `.react on/off` - Washa/Zima auto-react (kwa kila group/chat).
- `.statusview on/off` - Washa/Zima auto-view status.
- `.statuscomment on/off` - Washa/Zima auto-comment status.
- `.setstatusreply [text]` - Badilisha ujumbe wa status reply.
- `.kick @user` - Mtoe mtu kwenye group.
- `.add number` - Ongeza mtu kwenye group.
- `.promote @user` - Mfanye mtu admin.
- `.demote @user` - Mshushe admin.
- `.open` - Fungua group.
- `.close` - Funga group.
- `.tagall` - Tag watu wote.
- `.groupinfo` - Pata maelezo ya group.
- `.link` - Pata link ya group.
- `.resetlink` - Badilisha link ya group.

## TROUBLESHOOTING:

### "Couldn't login" Error:
Kama unapata hitilafu ya "Couldn't login" baada ya kuscan au kuingiza kodi:
1. Jaribu kuingiza kodi tena (kodi inatokea kila dakika)
2. Kama bado haijakamatia, kusafisha session:
   - Kwenye Render: Nenda kwenye **Files** > Futa folder ya `sessions`
   - Kisha restart bot
3. Hakikisha namba ya simu ni sahihi kwenye `PAIRING_NUMBER`
4. Jaribu kutumia QR code badala ya pairing code (ondoa `PAIRING_NUMBER` variable)

### Bot inakatika wakati wa kuunganisha:
1. Hakikisha MongoDB URI ni sahihi
2. Angalia kuwa internet connection ni thabiti
3. Jaribu kusafisha sessions folder na kuanza tena

---
**Made with ❤️ by Manus**
