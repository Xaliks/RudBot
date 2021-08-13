require("./utils/Structures")();
const { Client } = require("discord.js");
const { token } = require("./config.json");

const bot = new Client({
	partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
	intents: 32767,
	allowedMentions: { parse: ["users", "roles"] },
	ws: {
		properties: {
			$browser: "Discord Android",
			$device: "Discord Android",
		},
	},
});

require("./require")(bot);

process.on("unhandledRejection", (error) => bot.utils.sendError(bot, error));

bot.login(token);
