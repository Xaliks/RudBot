const { MessageEmbed } = require("discord.js");
const { owners } = require("../../config.json");
const names = {
	music: "Музыка",
	settings: "Настройка",
	general: "Основные команды",
	images: "Изображения",
	info: "Информация",
	profile: "Профиль",
};

module.exports = {
	name: "help",
	description: "Помощь",
	cooldown: 5,
	aliases: ["хелп", "помощь", "h"],
	usage: ["[команда]"],
	category: "info",
	async execute(message, args, bot) {
		const guild = bot.cache.get(message.guild.id);

		if (!args[0]) {
			const categories = [];
			bot.commands.forEach((cmd) => {
				if (!categories.includes(cmd.category) && names[cmd.category]) categories.push(cmd.category);
			});

			return bot.utils.pages(
				message,
				categories.map((category) => {
					const name = names[category] || "Категория";

					return new MessageEmbed().setTitle(name).setDescription(
						`**<> - Обязательное действие**\n**[] - Не обязательное действие**\n\n${bot.commands
							.filter((c) => c.category === category)
							.map(
								(c) =>
									`${guild.prefix}**${c.name}** ${c.usage?.map((us) => `\`${us}\``).join(" ") || ""} - ${c.description}`,
							)
							.join(`\n`)}`,
					);
				}),
			);
		}

		const command = bot.commands.find(
			(command) =>
				command.name === args[0].toLowerCase() || command.aliases?.some((alias) => alias === args[0].toLowerCase()),
		);
		if (!command || (command.admin && !owners.includes(message.author.id)))
			return bot.utils.error("Я не нашел эту команду!", this, message, bot);

		const aliases = command.aliases ? `\n**Псевдоним(-ы):** ${command.aliases.join(", ")}` : "";

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`Помощь`)
					.setDescription(
						`**Имя:** ${command.name}\n**Описание:** ${command.description}\n${aliases}\n**Использование:** ${
							guild.prefix
						}${command.name} ${command.usage?.map((u) => `\`${u}\``).join(" ") || ""}\n**Кулдаун:** ${bot.utils.time(
							command.cooldown * 1000 || 3000,
						)}`,
					),
			],
		});
	},
};
