const { MessageEmbed } = require("discord.js");
const { userinfo, emojis } = require("../../data/data.json");

module.exports = {
	name: "user-info",
	description: "Инфо о пользователе",
	aliases: ["u", "ui", "user", "usrinfo"],
	cooldown: 10,
	usage: ["[@Пользователь/ID]"],
	category: "info",
	async execute(message, args, bot) {
		let user = await bot.users.fetch(args[0], { force: true }).catch(() => message.author);
		let member = bot.utils.findMember(message, args.join(" "));
		if (!member && user.id === message.author.id) member = message.member;
		if (member) user = member.user;

		let description = `**[Аватар](${user.displayAvatarURL({ dynamic: true })})**`;
		if (user.banner) description += ` | **[Баннер](${user.bannerURL({ dynamic: true })})**`;
		if (member?.avatar) description += ` | **[Серверный аватар](${member.avatarURL({ dynamic: true })})**`;

		if (user.flags?.bitfield != 0)
			description += `\nЗначки: ${user.flags
				.toArray()
				.map((flag) => userinfo.badges[flag])
				.join(" ")}`;

		const embed = new MessageEmbed()
			.setAuthor({ name: `${user.id} | ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setThumbnail(user.displayAvatarURL({ dynamic: true }));

		if (Object.keys(member?.presence.clientStatus || {}).length) {
			description += "\nСтатус: ";

			for (const cs in member.presence.clientStatus) {
				description +=
					emojis[member.presence.clientStatus[cs]] +
					{ desktop: "Компьютер", web: "Веб-сайт", mobile: "Мобильное приложение" }[cs];
			}

			let activities = "";
			let customStatus;
			for (const activity of member.presence.activities) {
				if (activity.id != "custom") activities += `${userinfo.ActivityType[activity.type]} **${activity.name}**\n`;
				else customStatus = activity.state;
			}

			if (activities) embed.addField("Активность", activities.trim());
			if (customStatus) embed.addField("Пользовательский статус", bot.utils.escapeMarkdown(customStatus));
		} else description += `\nСтатус: ${emojis.offline}Оффлайн`;

		if (member?.roles.cache.size > 1) {
			const roles = member.roles.cache
				.sort((a, b) => b.rawPosition - a.rawPosition)
				.toJSON()
				.slice(0, -1);

			if (roles[0].color) embed.setColor(roles[0].color);
			embed.addField(`Роли [\`${bot.utils.formatNumber(member.roles.cache.size - 1)}\`]`, roles.join(" "), false);
		}

		if (member)
			embed.addField(
				`Присоединился к серверу\n[\`${
					message.guild.members.cache
						.map((member) => member.joinedTimestamp)
						.sort((a, b) => a - b)
						.indexOf(member.joinedTimestamp) + 1
				}\` / \`${message.guild.members.cache.size}\`]`,
				bot.utils.discordTime(member.joinedTimestamp),
				true,
			);

		embed.addField("Аккаунт создан", bot.utils.discordTime(user.createdTimestamp), true);
		embed.setDescription(description.trim());

		message.channel.send({ embeds: [embed] });
	},
};
