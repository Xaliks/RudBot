module.exports = {
	name: "remove-rep",
	description: "Понизить репутацию у пользователя",
	category: "reputation",
	aliases: ["removerep", "delete-rep", "delrep", "deleterep", "remrep"],
	cooldown: 20,
	usage: ["<@Пользователь>", "<Число>"],
	async execute(message, args, bot) {
		if (!message.member.permissions.has(["MANAGE_GUILD"]) || !message.member.permissions.has(["ADMINISTRATOR"]))
			return bot.utils.error("У вас нет прав! (**Управлять сервером**)", this, message, bot);

		let user;
		let member = bot.utils.findMember(message, args[0]);

		if (args[0] && /\d{17,18}/.test(args[0])) user = await bot.users.fetch(args[0]).catch(() => null);
		if (member) user = await bot.users.fetch(member.user.id);
		if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (user.bot) return bot.utils.error("Это бот. У ботов нет репутации!", this, message, bot);

		const amount = parseInt(args[1]);
		if (isNaN(amount)) return bot.utils.error(`\`${amount}\` не число!`, this, message, bot);

		await bot.database.member.findOneAndUpdateOrCreate(
			{ id: user.id, guild_id: message.guild.id },
			{
				$inc: {
					reputation: -amount,
				},
			},
		);
		bot.utils.success(`Вы убрали \`${amount}\`:star: у ${member || user.id}`, message);
	},
};
