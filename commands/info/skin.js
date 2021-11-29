const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "skin",
	description: "Поиск скинов из Minecraft",
	category: "info",
	cooldown: 5,
	usage: ["<Ник игрока>"],
	async execute(message, args, bot) {
		const data = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(args[0])}`)
			.then((res) => res.json())
			.catch((e) => null);

		if (!data) return bot.utils.error(`Игрок \`${args[0]}\` не найден!`, this, message, bot);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor({name:`Скин игрока ${bot.utils.escapeMarkdown(data.name)}`, iconURL: `https://crafatar.com/renders/head/${data.id}` })
					.setDescription(`[Скачать скин](https://crafatar.com/skins/${data.id})`)
					.setImage(`https://crafatar.com/renders/body/${data.id}`),
			],
		});
	},
};
