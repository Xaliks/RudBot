const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "meme",
	description: "Мем",
	cooldown: 5,
	category: "images",
	async execute(message, args, bot) {
		const data = await fetch("https://miss.perssbest.repl.co/api/v2/meme").then((res) => res.json());

		message.channel.send({
			embeds: [new MessageEmbed().setImage(data.image)],
		});
	},
};
