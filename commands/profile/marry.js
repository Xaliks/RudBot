module.exports = {
	name: "marry",
	description: "Пожениться",
	category: "profile",
	cooldown: 120,
	usage: ["<Пользователь>"],
	async execute(message, args, bot) {
		const member = await bot.utils.findMember(message, args.join(" "));

		if (!member) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (member.user.bot) return bot.utils.error("Это бот!", this, message, bot);
		if (member.id === message.author.id) bot.utils.error("Как вы поженитесь на себе?", this, message, bot);

		const filter = (m) => member.id === m.author.id;
		const DBuser = await bot.database.member.get({ id: member.id, guild_id: message.guild.id });
		const DBauthor = await bot.database.member.get({ id: member.id, guild_id: message.guild.id });
		const guild = await bot.database.guild.get({ id: message.guild.id });

		if (DBuser.marry) return bot.utils.error("Он(-а) уже состоит в браке!", this, message, bot);
		if (DBauthor.marry) return bot.utils.error("Вы уже состоите в браке!", this, message, bot);

		if (DBuser.gender === null)
			return bot.utils.error(
				`У ${member} пол **не определён!**
Попросите его/её поставить его командой ${guild.prefix}set-gender ${bot.commands.get("set-gender").usage}`,
				this,
				message,
				bot,
			);

		if (DBauthor.gender === null)
			return bot.utils.error(
				`Ваш пол **не определён!** 
Вы можете поставить его командой ${guild.prefix}set-gender ${bot.commands.get("set-gender").usage}`,
				this,
				message,
				bot,
			);

		if (DBuser.gender === DBauthor.gender) return bot.utils.error("У вас совпадает пол! :eyes:", this, message, bot);

		message.channel.send(`${member}, Вы хотите выйти замуж за ${message.author}? **Да/Нет** (У вас есть 15 секунд)`);

		message.channel
			.awaitMessages(filter, {
				time: 15000,
				max: 1,
				errors: ["time"],
			})
			.then(async (msgs) => {
				const msg = msgs.first();

				if (["y", "yes", "д", "да"].includes(msg.content.toLowerCase())) {
					bot.database.member.update({ id: member.id, guild_id: message.guild.id }, { marry: message.author.id });
					bot.database.member.update({ id: message.author.id, guild_id: message.guild.id }, { marry: member.id });

					bot.utils.success(`Вы поженились с ${user}. Поздравляю!`, msg);
				} else {
					message.channel.send(`${message.author}, Сочувствую.`);
				}
			})
			.catch(() => {
				bot.utils.error("Время вышло!", this, message, bot);
			});
	},
};
