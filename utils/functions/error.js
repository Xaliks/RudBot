const { emojis } = require("../../data/data.json");
const { MessageEmbed, Message, Client } = require("discord.js");

/**
 * @param {String} description Описание "Успешно"
 * @param {Object} command Структура команды
 * @param {Message} message Сообщение
 * @param {Client} bot Бот
 * @param {Boolean} deleteCooldown Убирать ли кулдаун на команду
 * @returns {MessageEmbed} Embed "Успешно"
 */
module.exports = (description, command, message, bot, deleteCooldown = true) => {
	if (deleteCooldown) bot.timestamps.delete(`${command.name}_${message.author.id}`);

	return message.reply({
		embeds: [new MessageEmbed().setTitle(`${emojis.error} Ошибка!`).setDescription(description).setColor("RED")],
	});
};
