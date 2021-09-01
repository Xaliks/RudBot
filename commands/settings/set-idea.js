const { owners } = require("../../config.json");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	name: "set-idea",
	description: "Поставить канал для идей",
	category: "settings",
	usage: ["[#Канал для идей]"],
	cooldown: 30,
	aliases: ["setidea"],
	async execute(message, args, bot) {
		const guild = await bot.database.guild.get({ id: message.guild.id });

		if (!args[0])
			return message.channel.send({
				embeds: [
					new MessageEmbed().setDescription(
						guild.idea_channel && guild.idea_channel != null
							? `Текущий канал для идей: <#${guild.idea_channel}>`
							: "Канал идей не установлен!",
					),
				],
			});

		if (
			!owners.includes(message.author.id) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_GUILD) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.ADMINISTRATOR)
		)
			return bot.utils.error("У вас нет прав! (**Управлять сервером** или **Администратор**)", this, message, bot);

		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.find((ch) => ch.name === args[0]) ||
			message.guild.channels.cache.find((ch) => ch.id === args[0]);
		if (!channel) return bot.utils.error("Канал не найден!", this, message, bot);
		if (channel.type != "GUILD_TEXT" && channel.type != "GUILD_NEWS")
			return bot.utils.error("Это не текстовой канал!", this, message, bot);

		bot.database.guild.update(
			{ id: message.guild.id },
			{
				idea_channel: channel.id,
			},
		);
		bot.utils.success(`Канал установлен! (${channel})`, message);
	},
};
