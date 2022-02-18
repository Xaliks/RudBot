const { errorLogsChannelId } = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (bot, error) => {
	if (!error) return;

	bot.channels.cache.get(errorLogsChannelId).send({
		content: "<@448799481777881089>",
		embeds: [
			new MessageEmbed().setDescription(`\`\`\`${JSON.stringify(error) === "{}" ? error : JSON.stringify(error)}\`\`\``),
		],
	});
};
