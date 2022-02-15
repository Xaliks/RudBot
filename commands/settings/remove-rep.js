module.exports = {
	name: "remove-rep",
	description: "Понизить репутацию у пользователя",
	category: "settings",
	aliases: ["removerep", "delete-rep", "delrep", "deleterep", "remrep"],
	cooldown: 20,
	usage: ["<@Пользователь>", "<Число>"],
	userPerms: ["MANAGE_GUILD"],
	async execute(message, args, bot) {
		let user;
		let member = await bot.utils.findMember(message, args[0]);

		if (args[0] && /\d{17,18}/.test(args[0])) user = await bot.users.fetch(args[0]).catch(() => null);
		if (member) user = await bot.users.fetch(member.user.id);
		if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (user.bot) return bot.utils.error("Это бот. У ботов нет репутации!", this, message, bot);

		const amount = parseInt(args[1]);
		if (isNaN(amount)) return bot.utils.error(`\`${args[1]}\` не число!`, this, message, bot);

		const reputation =
			(await bot.cache.find({ id: user.id, guild_id: message.guild.id }, "member").then((u) => u.reputation)) - amount;

		await bot.cache.update({ id: user.id, guild_id: message.guild.id }, { reputation }, "member");
		bot.utils.success(`Вы убрали \`${amount}\`:star: у ${member || user.id}`, message);
	},
};
