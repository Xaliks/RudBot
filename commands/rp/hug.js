const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "hug",
	description: "Обнять пользователя",
	usage: ["<@Пользователь>"],
	category: "rp",
	aliases: ["обнять", "обнимаю"],
	async execute(message, args, bot) {
		const data = await fetch("https://nekos.life/api/v2/img/hug").then((res) => res.json());
		const user = bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", message);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете обнять себя!`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} обнимает ${user}`).setImage(data.url)],
		});
	},
};
