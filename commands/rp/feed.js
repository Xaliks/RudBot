const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "feed",
	description: "Накормить пользователя",
	usage: ["<@Пользователь>"],
	category: "rp",
	aliases: ["кормить", "покормить", "кормлю"],
	async execute(message, args, bot) {
		const data = await fetch("https://nekos.life/api/v2/img/feed").then((res) => res.json());
		const user = bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете покормить себя! (Странно, да?)`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} кормит ${user}`).setImage(data.url)],
		});
	},
};
