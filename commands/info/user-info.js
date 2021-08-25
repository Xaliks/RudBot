const { MessageEmbed, User } = require("discord.js");
const { emoji } = require("../../data/emojis.json");
const { badges } = require("../../data/user-info");

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
		if (args[0] && /\d{17,18}/.test(args[0]))
			user = await bot.api
				.users(args[0])
				.get()
				.catch(() => null);
		if (member) user = await bot.api.users(member.user.id).get();
		if (!user) {
			user = await bot.api.users(message.author.id).get();
			member = message.member;
		}

		user = new User(bot, user);

		let description = `Аватар: **[Ссылка](${user.displayAvatarURL({ dynamic: true, size: 2048 })})**`;
		if (user.banner) description += ` | Баннер: **[Ссылка](${user.bannerURL({ dynamic: true, size: 2048 })})**`;
		if (!user.bot && user.flags && user.flags.bitfield != 0)
			description += `\nЗначки: ${user.flags
				.toArray()
				.map((flag) => badges[flag])
				.join(" ")}`;

		const embed = new MessageEmbed()
			.setAuthor(`${user.id} | ${user.tag}`)
			.setThumbnail(
				user.displayAvatarURL({
					dynamic: true,
					size: 2048,
				}),
			)
			.setFooter("Дизайн JeggyBot");

		if (member) {
			if (user.id === message.author.id) member = message.member;
			embed.setColor(member.displayHexColor);
			description += `\nПрисоединился: \`${
				Array.from(
					message.guild.members.cache.map((member) => member.joinedTimestamp).sort((a, b) => a - b),
				).indexOf(message.member.joinedTimestamp) + 1
			}\`/\`${message.guild.members.cache.size}\``;

			//Статус
			//-----------------------------------------------------------------------------
			const clientStatus = [];
			let status;
			let activity = "";
			if (member.presence && member.presence.status != "offline") {
				// Система
				//-----------------------------------------------------------------------------
				for (let cs in member.presence.clientStatus) {
					clientStatus.push(
						`${emoji[member.presence.clientStatus[cs]]} ${
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
						activity += require("../../utils/gamesEmoji")(act);
					}
				});
				//-----------------------------------------------------------------------------
			} else clientStatus.push(`${emoji.offline} Оффлайн`);
			//----------------------------------------------------------------------------

			//Роли
			//-----------------------------------------------------------------------------
			const roles = member.roles.cache
				.filter((r) => r !== message.guild.id)
				.sort((a, b) => b.position - a.position)
				.map((role) => role.toString())
				.slice(0, -1)
				.join(", ");

			const RolesCount = bot.utils.formatNumber(member.roles.cache.size - 1);
			//-----------------------------------------------------------------------------

			if (activity != "") embed.addField("Активность:", activity, true);
			if (clientStatus[0]) embed.addField("Статус:", clientStatus.join("\n"), true);
			if (status) embed.addField("Пользовательский статус:", status, true);
			if (roles) embed.addField(`**Роли (${RolesCount}):**`, roles, false);
			else embed.addField("\u200b", "\u200b", false);

			embed.addField("Зашел на сервер:", bot.utils.discordTime(member.joinedTimestamp), true);
		}
		embed.addField("Аккаунт создан:", bot.utils.discordTime(user.createdTimestamp), true);
		embed.setDescription(description);

		message.channel.send({ embeds: [embed] });
	},
};
