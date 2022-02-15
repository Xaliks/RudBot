const { MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const { languages } = require("../../data/data.json");

module.exports = {
	name: "translate",
	description: "Перевод вашего сообщения",
	category: "general",
	usage: ["<С>", "<На>", "<Текст>"],
	aliases: ["tr"],
	async execute(message, args, bot) {
		const from = args.shift().toLowerCase();
		const to = args.shift().toLowerCase();

		const tr = await translate(args.join(" "), { from, to }).catch(() => null);
		if (!tr)
			return bot.utils.error("Неизвестный код языка! Коды языков: https://jeggybot.xyz/languages", this, message, bot);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor({
						name: "Google Переводчик",
						iconURL:
							"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png",
						url: "https://translate.google.com",
					})
					.setDescription(tr.text)
					.setFooter({ text: `${languages[tr.from.language.iso]}  ->  ${languages[to]}` }),
			],
		});
	},
};
