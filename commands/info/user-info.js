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
		if (!member) {
			/* https://github.com/discordjs/discord.js/pull/6117
			
			if (args[0] && /\d{18}/.test(args[0])) user = await bot.users.fetch(args[0]);
			if (!user) {
				user = message.author;
				member = message.member;
			}
			*/
			try {
				if (args[0] && /\d{18}/.test(args[0]))
					user = new User(
						bot,
						await bot.api
							.users(args[0])
							.get()
							.catch(() => null),
					);
				else {
					user = new User(bot, await bot.api.users(message.author.id).get());
					member = message.member;
				}
			} catch (e) {
				user = new User(bot, await bot.api.users(message.author.id).get());
				member = message.member;
			}
		} else user = user = new User(bot, await bot.api.users(member.id).get());

		const embed = new MessageEmbed()
			.setAuthor(`${user.id} | ${user.tag}`)
			.setDescription(
				`Аватар: **[Ссылка](${user.displayAvatarURL({ dynamic: true, size: 2048 })})**${
					user.banner ? ` | Баннер: **[Ссылка](${user.bannerURL({ dynamic: true, size: 2048 })})**` : ""
				}${
					!user.bot && user.flags && user.flags.bitfield != 0
						? "\nЗначки: " +
						  user.flags
								.toArray()
								.map((flag) => badges[flag])
								.join(" ")
						: ""
				}`,
			)
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
			embed.description += `\nПрисоединился: \`${
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

		message.channel.send({ embeds: [embed] });
	},
};
