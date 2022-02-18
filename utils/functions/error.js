const { emojis } = require("../../data/data.json");
const { MessageEmbed } = require("discord.js");

module.exports = (description, command, message, bot, deleteCooldown = true) => {
	if (deleteCooldown) bot.timestamps.delete(`${command.name}_${message.author.id}`);

	return message.reply({
		embeds: [new MessageEmbed().setTitle(`${emojis.error} Ошибка!`).setDescription(description).setColor("RED")],
	});
};
