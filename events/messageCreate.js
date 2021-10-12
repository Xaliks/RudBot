const config = require("../config.json");
const { writeFileSync } = require("fs");
const { Permissions } = require("discord.js");
const data = require("../data/data.json");

module.exports = {
	name: "messageCreate",
	async execute(bot, message) {
		if (!message.guild) return;
		if (["739809196677267478", "782548346862043176"].includes(message.channel.id)) message.crosspost();
		if (message.author.bot) return;
		if (
			!message.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.SEND_MESSAGES) &&
			!message.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.ADMINISTRATOR)
		)
			return;

		//Команды
		//------------------------------------------------------------------------------------------------
		const guild = (await bot.database.guild.findOne({ id: message.guild.id })) || { prefix: "r!" };
		const user = (await bot.database.user.findOne({ id: message.author.id })) || { blacklisted: false };
		const args = message.content.slice(guild.prefix.length).trim().split(/ +/g);
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
									.replace(/<@&\d{18}>/gi, "`<пинг роли>`")
									.substr(1800)}**`
							: ""
					}`,
				);

			if (data.TBR.emojis[message.author.id]) {
				if (data.TBR.emojis[message.author.id].end === null || Date.now() < data.TBR.emojis[message.author.id].end)
					message.react(data.TBR.emojis[message.author.id].emoji).catch(() => null);
				else {
					delete data.TBR.emojis[message.author.id];
					writeFileSync("./data/data.json", JSON.stringify(data, null, 2));
				}
			}
		}
		//------------------------------------------------------------------------------------------------

		if (!commandName || !command || !message.content.startsWith(guild.prefix) || message.content === guild.prefix)
			return;
		if (bot.commands.has(command.name)) {
			if (command.category === "botowner" && !config.owners.includes(message.author.id)) return;
			if (user.blacklisted) return message.react("❌");

			if (command.usage && command.usage.filter((u) => !u.startsWith("[")).length > args.length)
				return bot.utils.error(
					`Правильное использование команды: \`${guild.prefix}${command.name} ${command.usage.join(" ")}\``,
					command,
					message,
					bot,
				);

			// ------ Кулдаун ------
			const timestamps = bot.cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown || 3) * 1000;
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
						false,
					);
				}
			}
			timestamps.set(message.author.id, Date.now());
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
			// !------ Кулдаун ------!

			// ------ Проверка прав ------
			if (command.userPerms) {
				const neededPerms = command.userPerms.map((perm) => {
					const permission = perm === "STAGE_MODERATOR" ? Permissions.STAGE_MODERATOR : Permissions.FLAGS[perm];

					if (
						!message.channel.permissionsFor(message.author.id).has(permission) &&
						!message.channel.permissionsFor(message.author.id).has(Permissions.FLAGS.ADMINISTRATOR)
					)
						return data.permissions[permission];
				});
				if (neededPerms[0])
					return bot.utils.error(
						`У вас недостаточно прав! (${neededPerms.map((perm) => `**${perm}**`).join(", ")})`,
						command,
						message,
						bot,
						false,
					);
			}
			if (command.botPerms) {
				const neededPerms = command.botPerms.map((perm) => {
					const permission = perm === "STAGE_MODERATOR" ? Permissions.STAGE_MODERATOR : Permissions.FLAGS[perm];

					if (
						!message.channel.permissionsFor(bot.user.id).has(permission) &&
						!message.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.ADMINISTRATOR)
					)
						return data.permissions[permission];
				});
				if (neededPerms[0])
					return bot.utils.error(
						`У бота недостаточно прав! (${neededPerms.map((perm) => `**${perm}**`).join(", ")})`,
						command,
						message,
						bot,
						false,
					);
			}
			// !------ Проверка прав ------!

			++config.botInfo.commands;
			writeFileSync("config.json", JSON.stringify(config, null, 2));
		}

		try {
			command.execute(message, args, bot);
		} catch (error) {
			bot.utils.error("Ошибка! Обратитесь к создателю бота.", this, message, bot, false);
		}
	},
};
