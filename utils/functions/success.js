const { emojis } = require("../../data/data.json");
const { MessageEmbed } = require("discord.js");

/**
 * @param {String} description Описание "Успешно"
 * @param {import("discord.js").Message} Сообщение
 * @returns {import("discord.js").MessageEmbed} Embed "Успешно"
 */
module.exports = (description, message) =>
	message.reply({
		embeds: [new MessageEmbed().setTitle(`${emojis.success} Успешно!`).setDescription(description).setColor("GREEN")],
	});
