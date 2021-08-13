const { MessageEmbed } = require("discord.js");
const Member = require("../../models/member");
const genders = {
	Male: "Мужской",
	Female: "Женский",
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
		const DBmember = await bot.database.member.get({ id: member.id, guild_id: message.guild.id });
		const data = (
			await Member.find({
				guild_id: message.guild.id,
			})
		)
			.sort((a, b) => b.reputation - a.reputation)
			.map((m, i) => {
				if (m.id === member.id) {
					return i;
				}
			})
			.filter((x) => x);

		let rank = bot.utils.formatNumber(+data + 1);
		let rep = bot.utils.formatNumber(DBmember.reputation);
		if (rep === 0) {
			rank = "Нет репутации";
			rep = "Нет репутации";
		}

		const gender = DBmember.gender != null ? genders[DBmember.gender] : "Не определён";
		const Umarry = DBmember.marry;
		const marry = Umarry
			? message.guild.members.cache.get(Umarry)
				? message.guild.members.cache.get(Umarry)
				: `Пользователя нет на сервере.`
			: `Нет никого...`;
		const Uage =
			DBmember.age != null
				? bot.utils.plural(DBmember.age, ["год", "года", "лет"])
				: "Не определён";

		if (marry === "Пользователя нет на сервере.") {
			bot.database.member.get({ id: member.id, guild_id: message.guild.id }, { marry: null });
		}

		const embed = new MessageEmbed()
			.setTitle("Профиль " + bot.utils.escapeMarkdown(member.user.tag))
			.addField(
				"Репутация",
				`
Кол-во репутации: \`${rep}\`
Место в топе: \`${rank}\``,
			)
			.addField(
				"Пользователь",
				`
Возраст: **${Uage}**
Пол: **${gender}**
В браке с **${marry}**`,
			);

		message.channel.send({ embeds: [embed] });
	},
};
