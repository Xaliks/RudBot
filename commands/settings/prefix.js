const { owners } = require("../../config.json");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	name: "prefix",
	description: "Поменять префикс бота",
	category: "settings",
	aliases: ["pref"],
	cooldown: 60,
	usage: ["[Новый префикс]"],
	async execute(message, args, bot) {
		const guild = await bot.database.guild.db.findOne({ id: message.guild.id });

		if (!args[0] || args[0] === guild.prefix)
			return message.channel.send({
				embeds: [new MessageEmbed().setDescription(`Текущий префикс: \`${bot.utils.escapeMarkdown(guild.prefix)}\``)],
			});
		if (args[0].length > 5) return bot.utils.error("Максимальная длина префикса: `5` символов!", this, message, bot);

		if (
			!owners.includes(message.author.id) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_GUILD) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.ADMINISTRATOR)
		)
			return bot.utils.error(
				`У вас недостаточно прав! (**Управлять сервером**)`,
				this,
				message,
				bot,
			);

		bot.database.guild.db.findOneAndUpdate({ id: message.guild.id }, { prefix: args[0] }).then(() => {
			bot.utils.success(`Вы успешно поставили новый префикс!\n\n\`${bot.utils.escapeMarkdown(guild.prefix)}\` -> \`${bot.utils.escapeMarkdown(args[0])}\``, message);
		})
	},
};
