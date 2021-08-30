const { errorLogsChannelId } = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (bot, error) => {
	if (!error) return;

	bot.channels.cache.get(errorLogsChannelId).send({
		content: "<@448799481777881089>",
		embeds: [
			new MessageEmbed()
				.setTitle("Новая ошибка!")
				.addField("**Код ошибки:**", `\`${error.code || "Неизвестно"}\``, true)
				.addField("**HTTP код:**", `\`${error.httpStatus || "Неизвестно"}\``, true)
				.addField("**Метод:**", `\`${error.method || "Неизвестно"}\``, true)
				.addField("**Путь:**", `\`${error.path || "Неизвестно"}\``, false)
				.addField(
					"**Json**",
					`\`\`\`${error.requestData ? JSON.stringify(error.requestData).substr(0, 1000) : "Отсутствует"}\`\`\``,
				)
				.setDescription(`**${error}**${error.stack ? `\n\`\`\`${error.stack}\`\`\`` : ""}`),
		],
	});
};
