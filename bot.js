const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
	ws: {
		properties: {
			$browser: "Discord Android",
			$device: "Discord Android",
		},
	},
	failIfNotExists: false,
});
bot.login(token);

bot.on("ready", () => {
	require("./require")(bot);

	process.on("unhandledRejection", (error) => bot.utils.sendError(bot, error));
	console.log(`[BOT] Зашёл как ${bot.user.tag}!`);
});
