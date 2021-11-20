const { owners } = require("../config.json");
const { Permissions } = require("discord.js");
const { permissions } = require("../data/data.json");

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
		const command = bot.commands.find(
			(command) => command.name === commandName || (command.aliases || []).some((alias) => alias === commandName),
		);
		//------------------------------------------------------------------------------------------------

		if (!commandName || !command || !message.content.startsWith(guild.prefix) || message.content === guild.prefix) return;
		if (bot.commands.has(command.name)) {
			if (command.category === "botowner" && !isDeveloper(message.author.id)) return;
			if (user.blacklisted) return message.react("❌");

			if (command.usage && command.usage.filter((u) => !u.startsWith("[")).length > args.length)
				return bot.utils.error(
					`Правильное использование команды: \`${guild.prefix}${command.name} ${command.usage.join(" ")}\``,
					command,
					message,
					bot,
					false,
				);

			// ------ Кулдаун ------
			if (!isDeveloper(message.author.id)) {
				const timestamp = bot.timestamps.get(`${command.name}_${message.author.id}`) || 0;
				const cooldown = (command.cooldown || 3) * 1000;
				const now = new Date().getTime();
				if (now - timestamp < cooldown)
					return bot.utils.error(
						`У вас задержка на команду \`${command.name}\`!\n\nОставшееся время: \`${bot.utils.time(
							cooldown - (now - timestamp),
						)}\``,
						command,
						message,
						bot,
						false,
					);

				bot.timestamps.set(`${command.name}_${message.author.id}`, now);
			}
			// !------ Кулдаун ------!

			// ------ Проверка прав ------
			if (!isDeveloper(message.author.id) && command.userPerms) {
				const neededPerms = command.userPerms.map((perm) => {
					if (
						!message.channel.permissionsFor(message.author.id).has(Permissions.FLAGS[perm]) &&
						!message.channel.permissionsFor(message.author.id).has(Permissions.FLAGS.ADMINISTRATOR)
					)
						return permissions[perm];
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
					if (
						!message.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS[perm]) &&
						!message.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.ADMINISTRATOR)
					)
						return permissions[perm];
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
		}

		try {
			command.execute(message, args, bot);
		} catch (error) {
			bot.utils.sendError(bot, { ...error, command: command.name, args: message.content });
			bot.utils.error("Ошибка! Обратитесь к создателю бота.", this, message, bot, false);
			console.error(error);
		}
	},
};

function isDeveloper(id) {
	return owners.includes(id);
}
