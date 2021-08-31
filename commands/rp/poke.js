const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "poke",
	description: "Тыкнуть в пользователя",
	usage: ["<@Пользователь>"],
	category: "rp",
	aliases: ["тыкнуть", "тыкаю"],
	async execute(message, args, bot) {
		const data = await fetch("https://nekos.life/api/v2/img/poke").then((res) => res.json());
		const user = bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете тыкать в себя!`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} тыкает в ${user}`).setImage(data.url)],
		});
	},
};
