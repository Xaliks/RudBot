const { readdirSync } = require("fs");
const { Collection } = require("discord.js");

module.exports = (bot) => {
	// Команды
	//-----------------------------------------------------------------------------
	readdirSync("./commands").forEach((dir) => {
		readdirSync(`./commands/${dir}`)
			.filter((f) => f.endsWith(".js"))
			.forEach((file) => {
				const command = require(`../../commands/${dir}/${file}`);

				if (command.aliases) {
					for (const alias of command.aliases) {
						bot.aliases.set(alias, command.name);
					}
				}
				if (!bot.cooldowns.has(command.name)) {
					bot.cooldowns.set(command.name, new Collection());
				}

				bot.commands.set(command.name, command);

				delete require.cache[require.resolve(`../../commands/${dir}/${file}`)];
			});
	});
	//-----------------------------------------------------------------------------

	// Ивенты
	//-----------------------------------------------------------------------------
	readdirSync("./events/")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			const event = require(`../../events/${file}`);

			bot.on(event.name, event.execute.bind(null, bot));

			delete require.cache[require.resolve(`../../events/${file}`)];
		});
	//-----------------------------------------------------------------------------

	// Функции
	//-----------------------------------------------------------------------------
	readdirSync("./utils/bot/")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			bot.utils[file.replace(".js", "")] = require(`../../utils/bot/${file}`);

			delete require.cache[require.resolve(`../../utils/bot/${file}`)];
		});
	//-----------------------------------------------------------------------------

	// Интеракции
	//-----------------------------------------------------------------------------
	readdirSync("./utils/commands/interact")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			bot.interactions[file.replace(".js", "")] = require(`../../utils/commands/interact/${file}`);

			delete require.cache[require.resolve(`../../utils/commands/interact/${file}`)];
		});
	//-----------------------------------------------------------------------------
};
