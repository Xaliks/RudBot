const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "random-joke",
	description: "Рандомная шутка",
	aliases: ["rj", "randomjoke"],
	category: "general",
	async execute(message, args, bot) {
		const data = await fetch("https://api.xaliks.xyz/random/joke").then((resp) => resp.json());

		message.channel.send({
			embeds: [new MessageEmbed().setTitle("Рандомная шутка").setDescription(data.ru.joke)],
		});
	},
};
