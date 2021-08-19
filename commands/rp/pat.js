const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "pat",
	description: "Погладить пользователя",
	usage: ["<@Пользователь>"],
	category: "rp",
	aliases: ["гладить", "погладить", "глажу"],
	async execute(message, args, bot) {
		const data = await fetch("https://nekos.life/api/v2/img/pat").then((res) => res.json());
		const user = bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", message);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете погладить себя!`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} гладит ${user}`).setImage(data.url)],
		});
	},
};
