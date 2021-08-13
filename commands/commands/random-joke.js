const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "random-joke",
	description: "Рандомная шутка",
	aliases: ["rj", "randomjoke"],
	category: "commands",
	async execute(message, args, bot) {
		const data = await fetch("http://api.xaliks.xyz/random/joke").then((resp) => {
			return resp.json();
		});
		message.channel.send({
			embeds: [new MessageEmbed().setTitle("Рандомная шутка").setDescription(data.ru.joke)],
		});
	},
};
