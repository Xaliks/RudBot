const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "kiss",
	description: "Поцеловать пользователя",
	usage: ["<@Пользователь>"],
	category: "rp",
	aliases: ["поцеловать", "kis", "целую"],
	async execute(message, args, bot) {
		if (message.guild.id === "681142809654591501") return;
		const data = await fetch("https://nekos.life/api/kiss").then((res) => res.json());
		const user = bot.utils.findMember(message, args.join(" "));

		if (!user) return bot.utils.error("Пользователь не найден!", message);
		if (message.author.id === user.id) return message.channel.send(`Вы не можете поцеловать себя!`);

		message.channel.send({
			embeds: [new MessageEmbed().setDescription(`${message.author} целует ${user}`).setImage(data.url)],
		});
	},
};
