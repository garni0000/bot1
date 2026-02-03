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
  const positions = ["🟩", "🟩", "🟩", "🟩", "🍎"];
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
  () => `⚠️ ENTRY LIVE — Accès limité
🍎 Apple : 4
🔐 Attempts : 5
⏰ Validité : 5 minutes

${generateSignal()}

🚫 Ne pas attendre la prochaine
🔥 Timing optimal détecté

⚠️ À suivre uniquement
si tu joues sur Melbet ou 1xBet
avec un compte pro authentique (code promo FSRAFA).
💸 Jouer maintenant ⬇️`,

  () => `🔥 ENTRY LIVE — Série détectée
🍎 Apple : 4
🔐 Attempts : 5
⏰ Validité : 5 minutes

${generateSignal()}

👥 Plusieurs joueurs déjà positionnés
⚠️ À suivre uniquement
si tu joues sur Melbet ou 1xBet
avec un compte pro authentique (code promo FSRAFA).

💸 Jouer maintenant ⬇️`,

  () => `🧠 ENTRY ANALYSÉE — Algo synchronisé
🍎 Apple : 4
🔐 Attempts : 5
⏰ Validité : 5 minutes

${generateSignal()}

⚠️ À suivre uniquement
si tu joues sur Melbet ou 1xBet
avec un compte pro authentique (code promo FSRAFA).

🔥 Bon timing actuel

💸 Jouer maintenant ⬇️`
];

/* =========================
   🧠 PSYCHOLOGIE INVERSÉE
========================= */
const psychoMessages = [
`Sans compte pro authentique,
les entrées ne se synchronisent pas correctement.

C’est pour ça que certains disent « ça marche pas »
et d’autres enchaînent.

À toi de voir dans quel groupe tu veux être.`,

`Même signal.
Même jeu.

Sans compte pro authentique,
la synchronisation ne se fait pas.

À toi de voir.`,

`La plupart jouent avec un compte classique.
Et la plupart perdent.

Ceux qui gagnent
ne jouent pas avec les mêmes paramètres.`
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
  [Markup.button.url("💸 Jouer maintenant", "https://cut.solkah.org/fs")],
  [Markup.button.url("📘 Comment jouer", "https://t.me/c/2246418480/105")]
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
   ⏰ CRON JOBS
========================= */

// 🔥 SIGNALS (4 / jour)
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

// 📊 RÉCAP
cron.schedule("30 23 * * *", () => {
  sendMessage(recapMessage());
});

// 🧠 PSYCHO INVERSÉE (aléatoire)
cron.schedule("*/45 * * * *", () => {
  if (Math.random() < 0.35) { // 35% de chance
    const msg = psychoMessages[Math.floor(Math.random() * psychoMessages.length)];
    sendMessage(msg);
  }
});

/* =========================
   🧑‍💻 COMMANDES ADMIN
========================= */
bot.command("send", (ctx) => {
  if (ctx.from.id.toString() !== adminId) return ctx.reply("⛔ Accès refusé");
  const tpl = entryTemplates[Math.floor(Math.random() * entryTemplates.length)];
  sendMessage(tpl());
  ctx.reply("✅ Signal envoyé");
});

bot.command("psy", (ctx) => {
  if (ctx.from.id.toString() !== adminId) return ctx.reply("⛔ Accès refusé");
  const msg = psychoMessages[Math.floor(Math.random() * psychoMessages.length)];
  sendMessage(msg);
  ctx.reply("🧠 Message psycho envoyé");
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
console.log("🚀 Bot lancé avec succès");
