module.exports = {
	name: "prefix",
	description: "Поменять префикс бота",
	category: "settings",
	aliases: ["pref"],
	cooldown: 60,
	usage: ["<Новый префикс>"],
	userPerms: ["MANAGE_GUILD"],
	async execute(message, args, bot) {
		if (args[0].length > 5) return bot.utils.error("Максимальная длина префикса: `5` символов!", this, message, bot);

		await bot.database.guild.findOneAndUpdateOrCreate({ id: message.guild.id }, { prefix: args[0] });
		bot.utils.success("Вы успешно поставили новый префикс", message);
	},
};
