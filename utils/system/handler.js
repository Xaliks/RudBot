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
	readdirSync("./events/").forEach((dir) => {
		readdirSync(`./events/${dir}`)
			.filter((f) => f.endsWith(".js"))
			.forEach((file) => {
				const event = require(`../../events/${dir}/${file}`);

				if (dir === "bot") bot.on(event.name, event.execute.bind(null, bot));
				else bot.music.on(event.name, event.execute.bind(null, bot));

				delete require.cache[require.resolve(`../../events/${dir}/${file}`)];
			});
	});
	//-----------------------------------------------------------------------------

	// Функции
	//-----------------------------------------------------------------------------
	readdirSync("./utils/functions/")
		.forEach((file) => {
			bot.utils[file.replace(".js", "")] = require(`../functions/${file}`);

			delete require.cache[require.resolve(`../functions/${file}`)];
		});
	//-----------------------------------------------------------------------------

	// Интеракции
	//-----------------------------------------------------------------------------
	readdirSync("./utils/commands")
		.forEach((file) => {
			bot.interactions[file.replace(".js", "")] = require(`../commands/${file}`);

			delete require.cache[require.resolve(`../commands/${file}`)];
		});
	//-----------------------------------------------------------------------------
};
