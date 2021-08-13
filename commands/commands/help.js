const { MessageEmbed } = require("discord.js");
const { owners } = require("../../config.json");

module.exports = {
	name: "help",
	description: "Помощь",
	cooldown: 5,
	aliases: ["хелп", "помощь", "h"],
	usage: ["[команда]"],
	category: "commands",
	async execute(message, args, bot) {
		const prefix = await bot.database.guild.get({ id: message.guild.id }).then((g) => g.prefix);

		if (!args[0]) {
			return bot.utils.pages(message, [
				Embeds("Настройка", "settings"),
				Embeds("Команды", "commands"),
				Embeds("РП", "rp"),
				Embeds("Инфо", "info"),
				Embeds("Репутация", "reputation"),
				Embeds("Профиль", "profile"),
			]);
		}

		const name = args[0].toLowerCase();
		const command =
			bot.commands.get(name) || bot.commands.find((c) => c.aliases && c.aliases.includes(name));
		if (!command) return bot.utils.error("Я не нашел эту команду!", message);
		if (command.admin && !owners.includes(message.author.id))
			return message.channel.send("Эта команда только для создателя бота!");

		const data = [];
		if (command.aliases) data.push(`\n**Псевдоним(-ы):** ${command.aliases.join(", ")}`);
		data.push(
			`\n**Использование:** ${prefix}${command.name} ${command.usage?.map((us) => `\`${us}\``).join(" ") || ""
			}`,
		);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`Помощь`)
					.setDescription(
						`**Имя:** ${command.name}\n**Описание:** ${command.description
						}\n${data}\n**Кулдаун:** ${bot.utils.time(command.cooldown * 1000 || 3000)}`,
					)
					.setTimestamp(),
			],
		});

		function Embeds(Title, category) {
			return new MessageEmbed().setAuthor(bot.user.username).setTitle(`Помощь **${Title}**`)
				.setDescription(`**<> - Обязательное действие**
**[] - Не обязательное действие**

${bot.commands
						.filter((c) => c.category === category)
						.map(
							(c) =>
								`${prefix}**${c.name}** ${c.usage?.map((us) => `\`${us}\``).join(" ") || ""} - ${c.description
								}`,
						)
						.join(`\n`)}`);
		}
	},
};
