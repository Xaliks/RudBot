const { Collection } = require("discord.js");
const Database = require("./utils/Database");
const { mongooseKey } = require("./config.json");

module.exports = (bot) => {
	bot.commands = new Collection();
	bot.cooldowns = new Collection();
	bot.aliases = new Collection();
	bot.utils = new Object();
	bot.database = new Database(mongooseKey);

	require("./utils/handler")(bot);
};
