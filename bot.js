require("./utils/system/Structures")();
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

const bot = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES],
	ws: {
		properties: {
			$browser: "Discord Android",
			$device: "Discord Android",
		},
	},
});
bot.login(token);

require("./require")(bot);

process.on("unhandledRejection", (error) => bot.utils.sendError(bot, error));
