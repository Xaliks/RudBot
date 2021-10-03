const { emoji } = require("../../data/emojis.json");
const { MessageEmbed, Message, Client } = require("discord.js");

/**
 * @param {String} description Описание "Успешно"
 * @param {Object} command Структура команды
 * @param {Message} message Сообщение
 * @param {Client} bot Бот
 * @param {Boolean} cooldown Убирать ли кулдаун на команду
 * @returns {MessageEmbed} Embed "Успешно"
 */
module.exports = (description, command, message, bot, cooldown = true) => {
	if (cooldown) bot.cooldowns.get(command.name)?.delete(message.author.id);

	return message.reply({
		embeds: [new MessageEmbed().setTitle(`${emoji.error} Ошибка!`).setDescription(description).setColor("RED")],
	});
};
