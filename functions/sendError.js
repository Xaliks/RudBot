const { errorLogsChannelId } = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (bot, error) => {
	if (!error) return;

	const channel = bot.channels.cache.get(errorLogsChannelId);

	channel.send({
		content: "<@448799481777881089>",
		embeds: [
			new MessageEmbed()
				.setTitle("Новая ошибка!")
				.addField("**Короткая ошибка:**", `\`${error}\``, true)
				.addField("**Имя:**", `\`${error.name || "Отстутствует"}\``, true)
				.addField("**Код ошибки:**", `\`${error.code || "Отстутствует"}\``, true)
				.addField("**Путь:**", `\`${error.path || "Отстутствует"}\``, true)
				.addField("**http Статус:**", `\`${error.httpStatus || "Отстутствует"}\``, true)
				.setDescription(`**Ошибка:**\n\`\`\`${error.stack || error}\`\`\``),
		],
	});
};
