module.exports = {
	name: "divorce",
	description: "Развестись",
	usage: ["<Пользователь>"],
	category: "profile",
	cooldown: 60,
	async execute(message, args, bot) {
		const member = await bot.utils.findMember(message, args.join(" "));

		if (!member) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (member.id === message.author.id) return bot.utils.error("Как вы разведётесь с собой?", this, message, bot);

		const DBuser = await bot.database.member.get({ id: member.id, guild_id: message.guild.id });
		const DBauthor = await bot.database.member.get({
			id: message.author.id,
			guild_id: message.guild.id,
		});

		if (DBuser.marry != message.author.id && DBauthor.marry != member.id)
			return bot.utils.error("Вы не пара!", this, message, bot);

		bot.database.member.update({ id: member.id, guild_id: message.guild.id }, { marry: null });
		bot.database.member.update({ id: message.author.id, guild_id: message.guild.id }, { marry: null });

		bot.utils.success(`Вы развелись с ${member}.`, message);
	},
};
