module.exports = {
	name: "set-age",
	description: "Поставить себе возраст",
	usage: ["<возраст>"],
	category: "profile",
	aliases: ["setage"],
	cooldown: 30,
	async execute(message, args, bot) {
		const age = parseInt(args[0]);
		if (isNaN(age)) return bot.utils.error("Это не чило!", this, message, bot);
		if (age > 50 || age < 5) return bot.utils.error("Возраст может быть только от `5` до `50`", this, message, bot);

		await bot.database.member.findOneAndUpdateOrCreate({ id: message.author.id, guild_id: message.guild.id }, { age });
		bot.utils.success(`Вы успешно поставили себе возраст!`, message);
	},
};
