const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "aresmine",
	description: "Получение информации о донатерах/онлайне сервера aresmine",
	category: "info",
	cooldown: 10,
	usage: ["<online/donaters>"],
	async execute(message, args, bot) {
		const type = args[0];

		switch (type) {
			case "online":
				fetch("https://aresmine.ru/engine/ajax.php?type=online")
					.then((resp) => resp.json())
					.then((data) => {
						message.channel.send({
							embeds: [
								new MessageEmbed()
									.setTitle("Онлайн сервера AresMine")
									.setDescription(
										`Текущий онлайн: \`${bot.utils.formatNumber(
											data.online,
										)}\` **${bot.utils.plural(
											data.online,
											["игрок", "игрока", "игроков"],
											false,
										)}**`,
									),
							],
						});
					});
				break;
			case "donaters":
				fetch("https://aresmine.ru/engine/ajax.php?type=donaters")
					.then((resp) => resp.json())
					.then((data) => {
						const embed = new MessageEmbed().setTitle("Последние 5 донатеров сервера AresMine");
						let interval = 0;

						data.forEach((d) => {
							if (interval === 3) embed.addField("\u200b", "\u200b", false);
							embed.addField(
								bot.utils.escapeMarkdown(d.name),
								`Дата покупки: **${d.date}**\nДонат: **${d.product}**`,
								true,
							);
							interval++;
						});

						message.channel.send({ embeds: [embed] });
					});
		}
	},
};
