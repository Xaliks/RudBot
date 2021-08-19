const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "meme",
	description: "Мем",
	cooldown: 5,
	category: "commands",
	aliases: ["мем", "mem"],
	async execute(message, args, bot) {
		if (message.guild.id === "681142809654591501") return;
		const data = await fetch("https://miss.perssbest.repl.co/api/v2/meme").then((res) => res.json());

		message.channel.send({
			embeds: [new MessageEmbed().setFooter(message.author.username).setImage(data.image)],
		});
	},
};
