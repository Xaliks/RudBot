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
	category: "settings",
	aliases: ["setgender"],
	async execute(message, args, bot) {
		const user = await bot.cache.find({ id: message.author.id, guild_id: message.guild.id }, "member");
		const gender = genders[args[0].toLowerCase()];

		if (user.marry) return bot.utils.error("У вас есть пара!", this, message, bot);
		if (!gender) return bot.utils.error("Вы должны поставить **правильный** пол!", this, message, bot);
		if (user.gender === gender) return bot.utils.error("Такой пол уже стоит!", this, message, bot);

		await bot.cache.update({ id: message.author.id, guild_id: message.guild.id }, { gender }, "member");
		bot.utils.success(`Вы успешно поставили себе **${gender === "Male" ? "Мужской" : "Женский"}** пол!`, message);
	},
};
