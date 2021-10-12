const { MessageEmbed } = require("discord.js");
const genders = {
	Male: "Мужской",
	Female: "Женский",
	None: "Не определён",
};

module.exports = {
	name: "profile",
	description: "Профиль",
	usage: ["[Пользователь]"],
	cooldown: 30,
	category: "profile",
	aliases: ["профиль"],
	async execute(message, args, bot) {
		const member = await bot.utils.findMember(message, args.join(" "), true);
		if (member.user.bot) return bot.utils.error("Это бот!", this, message, bot);

		const user = (await bot.database.member.findOne({ id: member.id, guild_id: message.guild.id })) || {
			reputation: 0,
			gender: null,
			age: null,
			marry: null,
		};
		const marry = user.marry ? await message.guild.members.fetch(user.marry).catch(() => null) : "Никого нет";
		if (!marry) {
			await bot.database.member.updateMany(
				{ guild_id: message.guild.id, id: { $regex: new RegExp(message.author.id + "|" + user.marry) } },
				{ $set: { marry: null } },
			);
		}

		const embed = new MessageEmbed()
			.setTitle("Профиль " + bot.utils.escapeMarkdown(member.user.tag))
			.addField(
				"Репутация",
				`Кол-во репутации: \`${bot.utils.formatNumber(user.reputation)}\`:star:
Место в топе: \`${
					user.reputation === 0
						? "Нет репутации"
						: bot.utils.formatNumber(
								(await bot.database.member.find({ guild_id: message.guild.id, reputation: { $ne: 0 } }))
									.sort((a, b) => b.reputation - a.reputation)
									.findIndex((m) => m.id === member.id),
						  )
				}\``,
			)
			.addField(
				"Пользователь",
				`Возраст: **${user.age ? bot.utils.plural(user.age, ["год", "года", "лет"]) : "Неизвестно"}**
Пол: **${genders[user.gender || "None"]}**
В браке с **${marry || "НЕТ НА СЕРВЕРЕ"}**`,
			);

		message.channel.send({ embeds: [embed] });
	},
};
