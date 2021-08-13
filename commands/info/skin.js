const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "skin",
	description: "Поиск скинов из Minecraft",
	category: "info",
	cooldown: 5,
	usage: ["<Ник игрока>"],
	async execute(message, args, bot) {
		const data = await fetch(
			`http://api.xaliks.xyz/info/minecraft?type=player&query=${encodeURIComponent(args[0])}`,
		).then((res) => res.json());

		if (data.error) return bot.utils.error(`Игрок \`${args[0]}\` не найден!`, message);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor(`Скин игрока ${bot.utils.escapeMarkdown(data.username)}`, data.skins.face)
					.setDescription(`[Скачать скин](${data.skins.skin})`)
					.setImage(data.skins.full),
			],
		});
	},
};
