const genders = {
	м: "Male",
	муж: "Male",
	мужской: "Male",
	male: "Male",
	m: "Male",

	ж: "Female",
	жен: "Female",
	женский: "Female",
	female: "Female",
	f: "Female",
};

module.exports = {
	name: "set-gender",
	description: "Поставить себе пол",
	usage: ["<м/ж>"],
	cooldown: 30,
	category: "profile",
	aliases: ["setgender"],
	async execute(message, args, bot) {
		const gender = genders[args[0].toLowerCase()];
		const user = await bot.database.member.get({
			id: message.author.id,
			guild_id: message.guild.id,
		});

		if (!gender) return bot.utils.error("Вы должны поставить **правильный** пол!", this, message, bot);
		if (user.gender === gender) return bot.utils.error("У вас уже стоит такой пол!", this, message, bot);
		if (user.marry && user.marry != null)
			return bot.utils.error(`У вас есть ${user.gender === "Female" ? "муж" : "жена"}!`, this, message, bot);

		bot.database.member.update(
			{ id: message.author.id, guild_id: message.guild.id },
			{
				gender,
			},
		);
		bot.utils.success(`Вы успешно поставили себе пол на **${gender === "Male" ? "Мужской" : "Женский"}**!`, message);
	},
};
