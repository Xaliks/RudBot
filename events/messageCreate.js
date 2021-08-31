let config = require("../config.json");
const { writeFileSync } = require("fs");
const TBR = require("../data/TBR.json");

module.exports = {
	name: "messageCreate",
	async execute(bot, message) {
		if (!message.guild) return;
		if (["739809196677267478", "782548346862043176"].includes(message.channel.id)) message.crosspost();
		if (message.author.bot) return;
		if (
			!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES") &&
			!message.channel.permissionsFor(message.guild.me).has("ADMINISTRATOR")
		)
			return;

		++config.botInfo.messages;

		//Команды
		//------------------------------------------------------------------------------------------------
		const prefix = await bot.database.guild.get({ id: message.guild.id }).then((g) => g.prefix);
		const user = await bot.database.user.get({ id: message.author.id });
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const cooldowns = bot.cooldowns;
		const commandName = args.shift().toLowerCase();
		const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
		//------------------------------------------------------------------------------------------------

		//ТБР
		//------------------------------------------------------------------------------------------------
		if (message.guild.id === "681142809654591501") {
			if (message.content === "112" || message.content.startsWith("112 "))
				return message.channel.send(
					`<@&775683300811341824>! Вас вызвал: ${message.author}${
						args[0]
							? `\nПричина вызова: **${args
									.join(" ")
									.replace("@everyone", "`<пинг всех>`")
									.replace(/<@&\d{18}>/gi, "`<пинг роли>`")}**`
							: ""
					}`,
				);

			if (TBR.emojis[message.author.id]) {
				if (TBR.emojis[message.author.id].end === null || Date.now() < TBR.emojis[message.author.id].end) {
					if (TBR.emojis[message.author.id].r != false ? Math.round(Math.random()) === 1 : true)
						message.react(TBR.emojis[message.author.id].emoji).catch(() => null);
				} else {
					delete TBR.emojis[message.author.id];
					writeFileSync("./data/TBR.json", JSON.stringify(TBR, null, 2));
				}
			}
		}
		//------------------------------------------------------------------------------------------------

		if (!commandName || !command || !message.content.startsWith(prefix) || message.content === prefix) return;
		if (bot.commands.has(command.name)) {
			if (user.blacklisted) return message.react("❌");

			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown || 3) * 1000;
			if (command.usage && command.usage.filter((u) => !u.startsWith("[")).length > args.length)
				return bot.utils.error(
					`Правильное использование команды: \`${prefix}${command.name} ${command.usage.join(" ")}\``,
					command,
					message,
					bot
				);
			if (command.category === "botowner" && !config.owners.includes(message.author.id))
				return bot.utils.error(`Эту команду может выполнять только создатель бота!`, this, message, bot, false);

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
				if (Date.now() < expirationTime && !config.owners.includes(message.author.id)) {
					return bot.utils.error(
						`У вас задержка на команду \`${command.name}\`!\n\nОставшееся время: \`${bot.utils.time(
							expirationTime - Date.now(),
						)}\``,
						command,
						message,
						bot,
						false
					);
				}
			}
			timestamps.set(message.author.id, Date.now());
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			++config.botInfo.commands;
		}

		try {
			command.execute(message, args, bot);
		} catch (error) {
			bot.utils.error("Ошибка! Обратитесь к создателю бота.", this, message, bot, false);
		}

		writeFileSync("config.json", JSON.stringify(config, null, 2));
	},
};
