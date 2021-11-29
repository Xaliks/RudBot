const { Collection } = require("discord.js");
const { LavacordManager } = require("lavacord");
const { mongooseKey, lavacordNodes } = require("./config.json");
const Database = require("./utils/system/Database");

module.exports = async (bot) => {
	bot.commands = new Collection();
	bot.timestamps = new Collection();
	bot.temp = new Collection();
	bot.utils = new Object();
	bot.interactions = new Object();
	bot.music = new LavacordManager(bot, lavacordNodes);
	bot.database = new Database(mongooseKey);

	await bot.music.connect();
	require("./utils/system/handler")(bot);
};
