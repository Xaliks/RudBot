const { errorLogsChannelId } = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "unhandledRejection",
	async execute(bot, err) {
		if (
			!String(err) ||
			String(err) === "DiscordAPIError: Missing Permissions" ||
			String(err) === "DiscordAPIError: Unknown Message"
		)
			return;

		sendErrorLog(bot, err);
	},
};

function sendErrorLog(bot, error) {
	const channel = bot.channels.cache.get(errorLogsChannelId);

	const name = error.name || "Отстутствует";
	const code = error.code || "Отстутствует";
	const httpStatus = error.httpStatus || "Отстутствует";
	const path = error.path || "Отстутствует";
	const stack = error.stack || error;

	channel.send({
		content: "<@448799481777881089>",
		embeds: [
			new MessageEmbed()
				.setTitle("Новая ошибка!")
				.addField("**Короткая ошибка:**", `\`${error}\``, true)
				.addField("**Имя:**", `\`${name}\``, true)
				.addField("**Код ошибки:**", `\`${code}\``, true)
				.addField("**Патч:**", `\`${path}\``, true)
				.addField("**http Статус:**", `\`${httpStatus}\``, true)
				.setDescription(`**Ошибка:**\n\`\`\`${stack}\`\`\``),
		],
	});
}
