const { MessageEmbed } = require("discord.js");

/**
 * TODO: Иконка роли
 */
module.exports = {
	name: "role-info",
	description: "Информация о роли",
	aliases: ["role", "роль", "roleinfo", "инфороль", "роль-инфо", "ri"],
	usage: ["<Роль/ID>"],
	cooldown: 5,
	category: "info",
	execute(message, args, bot) {
		const role =
			message.mentions.roles.first() ||
			message.guild.roles.cache.find((role) => role.name.toLowerCase() === args.join(" ").toLowerCase()) ||
			message.guild.roles.cache.find((role) => role.id === args[0]) ||
			message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));
		if (!role) return bot.utils.error("Не могу найти роль!", this, message, bot);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`**ИНФОРМАЦИЯ О РОЛИ**`)
					.setColor(role.color)
					.addField(`**Имя**`, `${bot.utils.escapeMarkdown(role.name)}`, true)
					.addField("**ID**", role.id, true)
					.addField("**Упоминание**", `\`${role}\` / ${role}`, true)
					.addField("**Пользователей с этой ролью:**", role.members.size, true)
					.addField("**Цвет**", role.hexColor.toUpperCase(), true)
					.addField("**Позиция:**", `${bot.utils.formatNumber(message.guild.roles.cache.size - role.position)}`, true)
					.addField("**Отображаемая роль?**", role.hoist ? "Да" : "Нет", true)
					.addField("**Упоминается?**", role.mentionable ? "Да" : "Нет", true)
					.addField("**Создана**", bot.utils.discordTime(data.createdTimestamp), true)

					.setFooter(message.author.username),
			],
		});
	},
};
