const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "kill",
	description: "Убить пользователя",
	usage: ["<@Пользователь>"],
	category: "images",
	async execute(message, args, bot) {
		const data = await fetch("https://miss.perssbest.repl.co/api/v2/kill").then((res) => res.json());
		const user = await bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете убить себя!`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} Убил ${user}`).setImage(data.image)],
		});
	},
};
