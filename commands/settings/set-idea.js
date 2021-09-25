const { owners } = require("../../config.json");
const { Permissions } = require("discord.js");

module.exports = {
	name: "set-idea",
	description: "Поставить канал для идей",
	category: "settings",
	usage: ["[#Канал для идей]"],
	cooldown: 30,
	aliases: ["setidea"],
	async execute(message, args, bot) {
		const guild = await bot.database.guild.findOne({ id: message.guild.id });

		if (!args[0])
			return message.channel.send({
				content: guild.idea_channel
					? `Текущий канал для идей: <#${guild.idea_channel}>`
					: "Канал для идей не установлен!",
			});

		if (
			!owners.includes(message.author.id) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_GUILD) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.ADMINISTRATOR)
		)
			return bot.utils.error("У вас нет прав! (**Управлять сервером**)", this, message, bot);

		const channel = findChannel(message, args[0]);
		if (!channel) return bot.utils.error("Канал не найден!", this, message, bot);
		if (channel.type != "GUILD_TEXT" && channel.type != "GUILD_NEWS")
			return bot.utils.error("Это не текстовой канал!", this, message, bot);

		await bot.database.guild.findOneAndUpdate({ id: message.guild.id }, { idea_channel: channel.id }).then(() => {
			bot.utils.success(`Канал установлен! (${channel})`, message);
		});
	},
};

function findChannel(message, channel) {
	return (
		message.mentions.channels.first() ||
		message.guild.channels.cache.find((ch) => ch.name.toLowerCase() === channel.toLowerCase()) ||
		message.guild.channels.cache.find((ch) => ch.id.toLowerCase() === channel.toLowerCase())
	);
}
