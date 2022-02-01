const Discord = require("discord.js");
const Structures = require("./utils/system/Structures");
const { mongooseKey, lavacordNodes } = require("./config.json");
const Database = require("./utils/system/Database");
const CacheManager = require("./utils/system/CacheManager");

module.exports = async (bot) => {
	bot.commands = new Discord.Collection();
	bot.timestamps = new Map();
	bot.temp = new Map();
	bot.utils = new Object();
	bot.interactions = new Object();
	bot.music = new Structures.MusicManager(bot, lavacordNodes);
	bot.database = new Database(mongooseKey);
	bot.cache = new CacheManager(bot);

	Discord.MessageEmbed = Structures.Embed;
	await bot.music.connect();
	require("./utils/system/handler")(bot);
};
