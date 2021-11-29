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
		let user;
		let member = bot.utils.findMember(message, args.join(" "));
		if (args[0] && /\d{17,18}/.test(args[0])) user = await bot.users.fetch(args[0], { force: true }).catch(() => null);
		if (member) user = await bot.users.fetch(member.user.id, { force: true });
		if (!user) {
			user = await bot.users.fetch(message.author.id, { force: true });
			member = message.member;
		}

		let description = `Аватар: **[Ссылка](${user.displayAvatarURL({ dynamic: true, size: 2048 })})**`;
		if (user.banner) description += ` | Баннер: **[Ссылка](${user.bannerURL({ dynamic: true, size: 2048 })})**`;
		if (!user.bot && user.flags && user.flags.bitfield != 0)
			description += `\nЗначки: ${user.flags
				.toArray()
				.map((flag) => userinfo.badges[flag])
				.join(" ")}`;

		const embed = new MessageEmbed()
			.setAuthor({name: `${user.id} | ${user.tag}`})
			.setThumbnail(
				user.displayAvatarURL({
					dynamic: true,
					size: 2048,
				}),
			)
			.setFooter("Дизайн JeggyBot");
		//Статус
		//-----------------------------------------------------------------------------
		const clientStatus = [];
		let status;
		let activity = "";
		if (member && member.presence && member.presence.status != "offline") {
			// Система
			//-----------------------------------------------------------------------------
			for (const cs in member.presence.clientStatus) {
				clientStatus.push(
					`${emojis[member.presence.clientStatus[cs]]} ${
						{
							desktop: "Компьютер",
							web: "Сайт",
							mobile: "Телефон",
						}[cs]
					}`,
				);
			}
			//-----------------------------------------------------------------------------

			// Статус
			//-----------------------------------------------------------------------------
			member.presence.activities.forEach((act) => {
				if (!act) return;
				if (act.id === "custom") status = act.state;
				else {
					let other;
					if (act.name === "Spotify") other = `(\`${act.state}\` - \`${act.details}\`)`;
					activity += `${userinfo.ActivityType[act.type]} **${act.name}** ${other}\n`;
				}
			});
			//-----------------------------------------------------------------------------
		} else clientStatus.push(`${emojis.offline} Оффлайн`);
		//----------------------------------------------------------------------------

		if (member) {
			if (user.id === message.author.id) member = message.member;
			description += `\nПрисоединился: \`${
				message.guild.members.cache
					.map((member) => member.joinedTimestamp)
					.sort((a, b) => a - b)
					.indexOf(member.joinedTimestamp) + 1
			}\`/\`${message.guild.members.cache.size}\``;

			//Роли
			//-----------------------------------------------------------------------------
			const roles = member.roles.cache
				.sort((a, b) => b.rawPosition - a.rawPosition)
				.toJSON()
				.slice(0, -1);

			if (roles) embed.addField(`**Роли (${bot.utils.formatNumber(roles.length)}):**`, roles.join(", "), false);
			//-----------------------------------------------------------------------------
		}

		if (activity != "") embed.addField("Активность:", activity, true);
		if (clientStatus[0]) embed.addField("Статус:", clientStatus.join("\n"), true);
		if (status) embed.addField("Пользовательский статус:", status, true);
		if (embed.fields.findIndex((field) => field.name.startsWith("**Роли (") || field.name === "\u200b") != -1)
			embed.fields.splice(embed.fields.length - 1, 0, embed.fields.splice(0, 1)[0]);
		else embed.addField("\u200b", "\u200b", false);

		if (member) embed.addField("Зашел на сервер:", bot.utils.discordTime(member.joinedTimestamp), true);
		embed.addField("Аккаунт создан:", bot.utils.discordTime(user.createdTimestamp), true);
		embed.setDescription(description);

		message.channel.send({ embeds: [embed] });
	},
};
