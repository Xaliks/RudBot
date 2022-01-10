const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "dance",
	description: "Танцевать",
	category: "images",
	async execute(message, args, bot) {
		const data = await fetch("https://miss.perssbest.repl.co/api/v2/dance").then((res) => res.json());

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} Танцует`).setImage(data.image)],
		});
	},
};
