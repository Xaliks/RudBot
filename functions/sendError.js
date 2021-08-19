const { errorLogsChannelId } = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (bot, error) => {
	if (!error) return;

	bot.channels.cache.get(errorLogsChannelId).send({
		content: "<@448799481777881089>",
		embeds: [
			new MessageEmbed()
				.setTitle("Новая ошибка!")
				.addField("**Короткая ошибка:**", `\`${error}\``, true)
				.addField("**Имя:**", `\`${error.name || "Отсутствует"}\``, true)
				.addField("**Код ошибки:**", `\`${error.code || "Отсутствует"}\``, true)
				.addField("**http Статус:**", `\`${error.httpStatus || "Отсутствует"}\``, true)
				.addField("**Путь:**", `\`${error.path || "Отсутствует"}\``, false)
				.addField(
					"**Json**",
					`\`\`\`${error.requestData ? JSON.stringify(error.requestData).substr(0, 4000) : "Отсутствует"}\`\`\``,
				)
				.setDescription(`**Ошибка:**\n\`\`\`${error.stack || error}\`\`\``),
		],
	});
};
