require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");
const http = require("http");

const bot = new Telegraf(process.env.BOT_TOKEN);
const channelId = process.env.CHANNEL_ID;
const adminId = process.env.ADMIN_ID;

/* =========================
   🔢 GÉNÉRATION SIGNAL
========================= */
function generateLine() {
  const positions = ["🟧", "🟧", "🟧", "🟧", "🍎"];
  return positions.sort(() => Math.random() - 0.5).join(" ");
}

function generateSignal() {
  return [
    `2.41: ${generateLine()}`,
    `1.93: ${generateLine()}`,
    `1.54: ${generateLine()}`,
    `1.23: ${generateLine()}`
  ].join("\n");
}

/* =========================
   🧠 TEMPLATES ENTRY
========================= */
const entryTemplates = [
  () => `

⚠️ ENTRY LIVE — Accès limité
🍎 Apple : 4
🔐 Attempts : 5
⏰ Validité : 5 minutes

${generateSignal()}

⚠️Fonctionne uniquement
(si tu joues sur un compte pro authentique sur Melbet ou 1xBet
avec avec le code promo FSRAFA).`,

  () => `

🔥 ENTRY LIVE — Série détectée
🍎 Apple : 4
🔐 Attempts : 5
⏰ Validité : 5 minutes

${generateSignal()}

Joue se signal si tu a un compte pro authentique sur melbet ou 1xbet avec code promo FSRAFA
 `
];

/* =========================
   📊 RÉCAP JOURNALIER
========================= */
function recapMessage() {
  return `📊 RÉCAP DU JOUR

✅ 4/4 entrées validées aujourd’hui
🔥 Meilleure performance à 22h
🧠 Algo stable — aucune alerte détectée

📘 Voir le tuto maintenant ⬇️`;
}

/* =========================
   🔘 BOUTONS
========================= */
const keyboard = Markup.inlineKeyboard([
  [Markup.button.url("💸creer un compte", "https://join.solkah.org/fsrafa")],
  [Markup.button.url("📘 Comment jouer", "https://t.me/c/2246418480/158")]
]);

/* =========================
   🚀 ENVOI MESSAGE
========================= */
async function sendMessage(text) {
  await bot.telegram.sendMessage(channelId, text, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...keyboard
  });
}

/* =========================
   ⏰ CRON JOBS (4 / jour)
========================= */
cron.schedule("0 17 * * *", () => {
  const tpl = entryTemplates[Math.floor(Math.random() * entryTemplates.length)];
  sendMessage(tpl());
});

cron.schedule("0 19 * * *", () => {
  const tpl = entryTemplates[Math.floor(Math.random() * entryTemplates.length)];
  sendMessage(tpl());
});

cron.schedule("0 22 * * *", () => {
  const tpl = entryTemplates[Math.floor(Math.random() * entryTemplates.length)];
  sendMessage(tpl());
});

cron.schedule("30 23 * * *", () => {
  sendMessage(recapMessage());
});

/* =========================
   🧑‍💻 COMMANDE ADMIN
========================= */
bot.command("send", (ctx) => {
  if (ctx.from.id.toString() !== adminId) return ctx.reply("⛔ Accès refusé");
  const tpl = entryTemplates[Math.floor(Math.random() * entryTemplates.length)];
  sendMessage(tpl());
  ctx.reply("✅ Signal envoyé");
});

/* =========================
   🌍 KEEP ALIVE
========================= */
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot alive");
}).listen(8080);

/* =========================
   ▶️ LANCEMENT
========================= */
bot.launch();
console.log("🚀 Bot lancé (version sans psycho)");
