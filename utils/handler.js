const { readdirSync } = require("fs");
const { sep } = require("path");
const { Collection } = require("discord.js");

module.exports = (bot) => {
	// Ивенты
	//-----------------------------------------------------------------------------
	readdirSync("./events/")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			const event = require(`../events/${file}`);

			bot.on(event.name, event.execute.bind(null, bot));

			delete require.cache[require.resolve(`../events/${file}`)];
		});
	//-----------------------------------------------------------------------------

	// Команды
	//-----------------------------------------------------------------------------
	readdirSync("./commands").forEach((dir) => {
		readdirSync(`./commands${sep}${dir}${sep}`)
			.filter((f) => f.endsWith(".js"))
			.forEach((file) => {
				const command = require(`../commands/${dir}/${file}`);

				if (command.aliases) {
					for (const alias of command.aliases) {
						bot.aliases.set(alias, command.name);
					}
				}
				if (!bot.cooldowns.has(command.name)) {
					bot.cooldowns.set(command.name, new Collection());
				}

				bot.commands.set(command.name, command);
			});
	});
	//-----------------------------------------------------------------------------

	// Функции
	//-----------------------------------------------------------------------------
	readdirSync("./functions/")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			bot.utils[file.replace(".js", "")] = require(`../functions/${file}`);

			delete require.cache[require.resolve(`../functions/${file}`)];
		});
	//-----------------------------------------------------------------------------
};
