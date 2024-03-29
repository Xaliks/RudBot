const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "random-word",
	description: "Случайное слово",
	aliases: ["rw", "randomword"],
	category: "general",
	async execute(message, args, bot) {
		const data = await fetch("https://api.xaliks.xyz/random/word").then((resp) => resp.json());

		message.channel.send({
			embeds: [new MessageEmbed().setTitle("Рандомное слово").setDescription(data.ru)],
		});
	},
};
