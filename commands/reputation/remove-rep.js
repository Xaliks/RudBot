module.exports = {
	name: "remove-rep",
	description: "Убрать репутацию у пользователя",
	category: "reputation",
	aliases: ["removerep", "delete-rep", "delrep", "deleterep", "remrep"],
	cooldown: 20,
	usage: ["<@Пользователь>", "<Число>"],
	async execute(message, args, bot) {
		if (!message.member.permissions.has(["MANAGE_MESSAGES"]) || !message.member.permissions.has(["ADMINISTRATOR"]))
			return bot.utils.error("У вас нет прав! (**Управлять сообщениями**)", this, message, bot);

		const member = bot.utils.findMember(message, args[0]);
		if (!member) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (member.user.bot) return bot.utils.error("Это бот. У ботов нет репутации!", this, message, bot);

		const amount = Number(args[1]);
		if (isNaN(amount)) return bot.utils.error(`\`${amount}\` не число!`, this, message, bot);
		if (amount <= 0) return bot.utils.error("А зачем?", this, message, bot);

		const DBuser = await bot.database.member.get({ id: member.id, guild_id: message.guild.id });
		if (DBuser.reputation < amount)
			return bot.utils.error(
				`У пользователя нет столько репутации! У него: \`${DBuser.reputation}\` **${bot.utils.plural(
					DBuser.reputation,
					["очко", "очка", "очков"],
					false,
				)} репутации**`,
				this,
				message,
				bot,
			);

		bot.database.member.update(
			{ id: member.id, guild_id: message.guild.id },
			{
				reputation: DBuser.reputation - amount,
			},
		);
		bot.utils.success(
			`Вы убрали \`${amount}\` **${bot.utils.plural(amount, ["очко", "очка", "очков"], false)} репутации** у ${member}`,
			message,
		);
	},
};
