const { Collection } = require("discord.js");
const Database = require("./utils/system/Database");
const { mongooseKey } = require("./config.json");

module.exports = (bot) => {
	bot.commands = new Collection();
	bot.timestamps = new Collection();
	bot.temp = new Collection();
	bot.utils = new Object();
	bot.interactions = new Object();
	bot.database = new Database(mongooseKey);

	require("./utils/system/handler")(bot);
};
