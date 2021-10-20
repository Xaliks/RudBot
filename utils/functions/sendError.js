const { errorLogsChannelId } = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (bot, error) => {
	if (!error) return;

	const embed = new MessageEmbed().setTitle("Новая ошибка!")

	if (error.command) embed.addField("Команда", error.command)
	if (error.args) embed.addField("Аргументы", bot.utils.escapeMarkdown(error.args))
	if (error.code) embed.addField("Код ошибки", error.code)
	if (error.httpStatus) embed.addField("Статус", error.httpStatus)
	if (error.method) embed.addField("Метод", error.method)
	if (error.path) embed.addField("Путь", error.path)
	if (error.requestData) embed.addField("JSON", `\`\`\`${JSON.stringify(error.requestData)}\`\`\``, false)
	if (error.stack) embed.setDescription(`\`\`\`${error.stack}\`\`\``)


	bot.channels.cache.get(errorLogsChannelId).send({
		content: "<@448799481777881089>",
		embeds: [embed],
	});
};
