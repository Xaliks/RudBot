const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "slap",
	description: "Дать пощечины пользователю.",
	usage: ["<@Пользователь>"],
	category: "rp",
	async execute(message, args, bot) {
		const data = await fetch("https://nekos.life/api/v2/img/slap").then((res) => res.json());
		const user = bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", message);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете дать себе пощечину!`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} даёт пощечину ${user}`).setImage(data.url)],
		});
	},
};
