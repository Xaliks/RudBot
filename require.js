const { Collection } = require("discord.js");
const { LavacordManager } = require("lavacord");
const { mongooseKey, lavacordNodes } = require("./config.json");
const Database = require("./utils/system/Database");

module.exports = (bot) => {
	bot.commands = new Collection();
	bot.timestamps = new Collection();
	bot.temp = new Collection();
	bot.utils = new Object();
	bot.interactions = new Object();
	bot.music = {
		players: new Map(),
		manager: new LavacordManager(bot, lavacordNodes)
	};
	bot.database = new Database(mongooseKey);

	require("./utils/system/handler")(bot);
};
