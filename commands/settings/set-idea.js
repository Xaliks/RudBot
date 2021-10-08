module.exports = {
	name: "set-idea",
	description: "Поставить канал для идей",
	category: "settings",
	usage: ["<#Канал для идей>"],
	cooldown: 30,
	aliases: ["setidea"],
	userPerms: ["MANAGE_GUILD"],
	async execute(message, args, bot) {
		const channel = findChannel(message, args[0]);
		if (!channel) return bot.utils.error("Канал не найден!", this, message, bot);
		if (channel.type != "GUILD_TEXT" && channel.type != "GUILD_NEWS")
			return bot.utils.error("Это не текстовой канал!", this, message, bot);

		await bot.database.guild.findOneAndUpdateOrCreate({ id: message.guild.id }, { idea_channel: channel.id });
		bot.utils.success(`Канал установлен! (${channel})`, message);
	},
};

function findChannel(message, channel) {
	return (
		message.mentions.channels.first() ||
		message.guild.channels.cache.find((ch) => ch.name.toLowerCase() === channel.toLowerCase()) ||
		message.guild.channels.cache.find((ch) => ch.id.toLowerCase() === channel.toLowerCase())
	);
}
