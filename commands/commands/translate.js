const { MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
	name: "translate",
	description: "Перевод вашего сообщения",
	category: "commands",
	usage: ["<С>", "<На>", "<Текст>"],
	aliases: ["tr"],
	async execute(message, args, bot) {
		const from = args[0];
		const to = args[1];

		translate(args.slice(2).join(" "), {
			from: from,
			to: to,
		})
			.then((result) => {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setDescription(result.text)
							.setFooter(message.author.username)
							.setTimestamp()
							.setTitle("Google Переводчик"),
					],
				});
			})
			.catch((e) => {
				if (String(e).startsWith("Error: The language "))
					return bot.utils.error(
						"Неизвестный код языка! Коды языков: https://jeggybot.ml/languages",
						message,
					);
				else bot.utils.error("Произошла ошибка!", message);
			});
	},
};
