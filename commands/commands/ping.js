﻿const { MessageEmbed } = require("discord.js");
const { emoji } = require("../../data/emojis.json");
const fetch = require("node-fetch");

module.exports = {
	name: "ping",
	description: "Проверка пинга бота",
	cooldown: 5,
	category: "commands",
	aliases: ["пинг", "понг", "pong"],
	async execute(message, args, bot) {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor("303136")
					.setTitle("Пинг")
					.setDescription(
						`Ответ на команды: ${emojis(Date.now() - message.createdTimestamp)}ms
WS Пинг: ${emojis(bot.ws.ping)}ms

[Пожертвовать](https://www.donationalerts.com/r/xaliksss) на [хостинг](https://hostvds.com/donate/pay-with?id=14ef2d9d-d8ff-4b13-bd88-9411976b6e1d&donate_to=061b7539#card-stripe)`,
					)
					.setTimestamp(),
			],
		});
	},
};

function emojis(ping) {
	let data = emoji.online;
	if (ping >= 1000) data = emoji.dnd;
	else if (ping >= 500) data = emoji.idle;

	return data + ping;
}
