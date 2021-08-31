module.exports = {
	name: "set-age",
	description: "Поставить себе возраст",
	usage: ["<возраст>"],
	category: "profile",
	aliases: ["setage"],
	cooldown: 30,
	async execute(message, args, bot) {
		const age = Number(args[0]);
		const user = await bot.database.member.get({
			id: message.author.id,
			guild_id: message.guild.id,
		});

		if (!age) return bot.utils.error("Вы должны поставить **правильный** возраст!", this, message, bot);
		if (age > 50 || age < 5) return bot.utils.error("Возраст может быть только от `5` до `50`", this, message, bot);
		if (user.age === age) return bot.utils.error("У вас уже стоит такой возраст!", this, message, bot);

		bot.database.member.update(
			{ id: message.author.id, guild_id: message.guild.id },
			{
				age,
			},
		);
		bot.utils.success(`Вы успешно поставили себе возраст!`, this, message, bot);
	},
};
