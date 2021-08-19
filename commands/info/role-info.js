const { MessageEmbed } = require("discord.js");

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

		if (!role) return bot.utils.error("Не могу найти роль!", message);

		let mentionable = role.mentionable ? "Да" : "Нет";
		let hoist = role.hoist ? "Да" : "Нет";
		let name = role.name;
		let id = role.id;
		let color = role.color;
		let position = message.guild.roles.cache.size - role.position;

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`**ИНФОРМАЦИЯ О РОЛИ**`)
					.setColor(color)
					.addField(`**Имя**`, `${bot.utils.escapeMarkdown(name)}`, true)
					.addField("**ID**", id, true)
					.addField("**Упоминание**", `\`${role}\` / ${role}`, true)
					.addField("**Пользователей с этой ролью:**", role.members.size, true)
					.addField("**Цвет**", role.hexColor.toUpperCase(), true)
					.addField("**Позиция:**", `${bot.utils.formatNumber(position)}`, true)
					.addField("**Отображаемая роль?**", hoist, true)
					.addField("**Упоминается?**", mentionable, true)
					.addField("**Создана**", bot.utils.discordTime(data.createdTimestamp), true)

					.setFooter(message.author.username),
			],
		});
	},
};
