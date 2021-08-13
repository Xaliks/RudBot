const { readdirSync } = require("fs");
const { sep } = require("path");
const { Collection } = require("discord.js");

module.exports = (bot) => {
	///////////////////////////////////////////////////////////////////////////////////////

	const eventFiles = readdirSync("./events/").filter((file) => file.endsWith(".js"));

	eventFiles.forEach((file) => {
		const event = require(`../events/${file}`);

		bot.on(event.name, event.execute.bind(null, bot));

		delete require.cache[require.resolve(`../events/${file}`)];
	});

	///////////////////////////////////////////////////////////////////////////////////////

	readdirSync("./commands").forEach((dirs) => {
		const commands = readdirSync(`./commands${sep}${dirs}${sep}`).filter((f) => f.endsWith(".js"));

		for (const file of commands) {
			const cmd = require(`../commands/${dirs}/${file}`);

			if (cmd.aliases) {
				for (const alias of cmd.aliases) {
					bot.aliases.set(alias, cmd.name);
				}
			}

			bot.commands.set(cmd.name, cmd);

			const cooldowns = bot.cooldowns;

			if (!cooldowns.has(cmd.name)) {
				cooldowns.set(cmd.name, new Collection());
			}
		}
	});

	///////////////////////////////////////////////////////////////////////////////////////

	const functionsFiles = readdirSync("./functions/").filter((file) => file.endsWith(".js"));

	functionsFiles.forEach((file) => {
		bot.utils[file.replace(".js", "")] = require(`../functions/${file}`);

		delete require.cache[require.resolve(`../functions/${file}`)];
	});
};
