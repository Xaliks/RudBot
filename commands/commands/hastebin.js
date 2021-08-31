const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "hastebin",
	description: "Написать свой текст в hastebin.com",
	aliases: ["haste"],
	cooldown: 10,
	usage: ["<Ваш текст>"],
	category: "commands",
	async execute(message, args, bot) {
		try {
			const data = await fetch(`https://hastebin.com/documents`, {
				method: "POST",
				body: args.join(" "),
				headers: { "Content-Type": "text/plain" },
			}).then((resp) => resp.json());

			message.channel.send({
				embeds: [new MessageEmbed().setDescription(`Ваша ссылка: https://hastebin.com/${data.key}`)],
			});
		} catch (e) {
			bot.utils.error("Hastebin не может создать документ! Попробуйте позже", this, message, bot);
		}
	},
};
