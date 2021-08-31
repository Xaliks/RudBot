const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
	name: "reload",
	description: "Перезагрузить команду",
	aliases: ["rel"],
	usage: ["[команда/категория]"],
	category: "botowner",
	execute(message, args, bot) {
		try {
			if (!args[0]) {
				bot.commands.each((command) => {
					delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
					try {
						const newCommand = require(`../${command.category}/${command.name}.js`);
						bot.commands.set(newCommand.name, newCommand);
					} catch (e) {
						bot.commands.delete(command.name);
					}
				});

				return message.channel.send({
					embeds: [
						new MessageEmbed().setTitle("Reload").setDescription(`**Перезагружено \`${bot.commands.size}\` команд.**`),
					],
				});
			}
			const name = args[0].toLowerCase();
			const command = bot.commands.get(name) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));

			if (!command) {
				found = false;
				readdirSync("./commands").forEach((category) => {
					if (name === category) {
						bot.commands
							.filter((cmd) => cmd.category === name)
							.each((command) => {
								delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
								try {
									const newCommand = require(`../${command.category}/${command.name}.js`);
									bot.commands.set(newCommand.name, newCommand);
								} catch (e) {
									bot.commands.delete(name);
								}
							});
						found = true;
						return message.channel.send({
							embeds: [
								new MessageEmbed()
									.setTitle("Reload")
									.setDescription(
										`**Перезагружено \`${
											bot.commands.filter((cmd) => cmd.category.toLowerCase() === name).size
										}\` команд.**`,
									),
							],
						});
					}
				});
				if (found) return;
				return bot.utils.error("Команда или категория не найдена!", this, message, bot);
			}

			delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];

			try {
				const newCommand = require(`../${command.category}/${command.name}.js`);
				bot.commands.set(newCommand.name, newCommand);
			} catch (e) {
				bot.commands.delete(name);
			}
			message.channel.send({
				embeds: [
					new MessageEmbed().setTitle("Успешно!").setDescription(`Имя: **${command.name}**
Категория: **${command.category}**
Псевдонимы: ${command.aliases ? command.aliases.map((a) => `\`${a}\``).join(", ") : "**Отсутствуют**"}
Команда создателя? **${command.admin ? "Да" : "Нет"}**
Нужны аргументы? **${command.usage?.filter((u) => !u.startsWith("[")) ? "Да" : "Нет"}**`),
				],
			});
		} catch (err) {
			bot.utils.error(`\`\`\`${err.stack}\`\`\``, this, message, bot);
		}
	},
};
