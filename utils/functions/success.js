const { emojis } = require("../../data/data.json");
const { MessageEmbed } = require("discord.js");

module.exports = (description, message) =>
	message.reply({
		embeds: [new MessageEmbed().setTitle(`${emojis.success} Успешно!`).setDescription(description)],
	});
