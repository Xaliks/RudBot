const { MessageEmbed } = require("discord.js");
const { emojis } = require("../../data/data.json");

module.exports = {
	name: "ping",
	description: "Проверка пинга бота",
	cooldown: 5,
	category: "general",
	aliases: ["pong"],
	async execute(message, args, bot) {
		message.channel.send({
			embeds: [
				new MessageEmbed().setTitle("Пинг").setDescription(
					`Ответ на команды: ${emoji(Date.now() - message.createdTimestamp)}ms
WS Пинг: ${emoji(bot.ws.ping)}ms

[Пожертвовать](https://www.donationalerts.com/r/xaliksss) на [хостинг](https://firstvds.ru/?from=1084442)`,
				),
			],
		});
	},
};

function emoji(ping) {
	let data = emojis.online;
	if (ping >= 1000) data = emojis.dnd;
	else if (ping >= 500) data = emojis.idle;

	return data + ping;
}
