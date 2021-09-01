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
		const Nprefix = args[0];
		const guild = await bot.database.guild.get({ id: message.guild.id });

		if (!Nprefix || Nprefix === guild.prefix)
			return message.channel.send({
				embeds: [new MessageEmbed().setDescription(`Текущий префикс: \`${guild.prefix}\``)],
			});
		if (Nprefix.length > 5) return bot.utils.error("Максимальная длина префикса: `5` символов!", this, message, bot);

		if (
			!owners.includes(message.author.id) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_GUILD) &&
			!message.channel.permissionsFor(message.member).has(Permissions.FLAGS.ADMINISTRATOR)
		)
			return bot.utils.error(
				`У вас недостаточно прав! (**Управлять сервером** или **Администратор**)`,
				this,
				message,
				bot,
			);
		bot.database.guild.update({ id: message.guild.id }, { prefix: Nprefix });

		bot.utils.success(`Вы успешно поставили новый префикс! Теперь он \`${Nprefix}\``, message);
	},
};
