const { readdirSync } = require("fs");

module.exports = (bot) => {
	// Команды
	//-----------------------------------------------------------------------------
	readdirSync("./commands").forEach((dir) => {
		readdirSync(`./commands/${dir}`)
			.filter((f) => f.endsWith(".js"))
			.forEach((file) => {
				const command = require(`../../commands/${dir}/${file}`);

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
	readdirSync("./utils/functions/")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			bot.utils[file.replace(".js", "")] = require(`../functions/${file}`);

			delete require.cache[require.resolve(`../functions/${file}`)];
		});
	//-----------------------------------------------------------------------------

	// Интеракции
	//-----------------------------------------------------------------------------
	readdirSync("./utils/commands/interact")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			bot.interactions[file.replace(".js", "")] = require(`../commands/interact/${file}`);

			delete require.cache[require.resolve(`../commands/interact/${file}`)];
		});
	//-----------------------------------------------------------------------------
};
