const { MessageEmbed } = require("discord.js");
const { AlexFlipNoteKey } = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
	name: "color",
	description: "Цвет",
	cooldown: 7,
	aliases: ["цвет"],
	usage: ["<Цвет в HEX формате>"],
	category: "commands",
	async execute(message, args, bot) {
		let text = args[0];
		if (text.startsWith("#")) text = text.slice(1);
		const color = encodeURIComponent(text);

		const data = await fetch(`https://api.alexflipnote.dev/color/${color}`, {
			headers: {
				Authorization: AlexFlipNoteKey,
			},
		}).then((res) => res.json());

		if (data?.code === 400)
			return bot.utils.error("Цвет не найден! (пример: `FFFFFF` или `ffffff`)", this, message, bot);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`${data.name} (${data.hex.toUpperCase()})`)
					.setDescription(
						`Яркость: \`${data.brightness}\`
\`${data.rgb}\``,
					)
					.setImage(data.image_gradient)
					.setThumbnail(data.image)
					.setColor(data.hex)
					.addField("Градиент:", data.tint.join(", "), true),
			],
		});
	},
};
