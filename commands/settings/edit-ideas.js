module.exports = {
	name: "edit-ideas",
	description: "Настроить идеи",
	category: "settings",
	usage: ["<channel/role> [...]"],
	cooldown: 30,
	aliases: ["editideas", "editidea", "set-ideas", "setideas", "set-idea", "setidea"],
	userPerms: ["MANAGE_GUILD"],
	async execute(message, args, bot) {
		const [type, ...options] = args;
		const guild = bot.cache.get(message.guild.id);

		await bot.cache.delete({ id: message.guild.id }, "idea_channel", "guild");

		if (!["channel", "role"].includes(type)) return bot.utils.error(`Правильное использование команды: \`${guild.prefix}${this.name} ${this.usage.join(" ")}\``, this, message, bot)

		if (type.toLowerCase() === "channel") {
			if (!options?.[0]) return bot.utils.error("Канал не указан!", this, message, bot);
			
			const channel = findChannel(message, options.join(" "));
			if (!channel) return bot.utils.error("Канал не найден!", this, message, bot);
			if (channel.type != "GUILD_TEXT") return bot.utils.error("Это не текстовой канал!", this, message, bot);

			await bot.cache.update({ id: message.guild.id }, { ideas: { id: channel.id } }, "guild");

			bot.utils.success(`Канал установлен! (${channel})`, message);
		}

		if (type.toLowerCase() === "role") {
			if (!options?.[0]) return bot.utils.error("Роль не указана!", this, message, bot);

			const role = findRole(message, options.join(" "));
			if (!role) return bot.utils.error("Роль не найдена!", this, message, bot);

			await bot.cache.update({ id: message.guild.id }, { ideas: { role: role.id } }, "guild");

			bot.utils.success(`Пингуемая роль установлена! (${role})`, message);
		}
	},
};

function findChannel(message, find) {
	return (
		message.mentions.channels.first() ||
		message.guild.channels.cache.get(find) ||
		message.guild.channels.cache.find((ch) => ch.name.toLowerCase().startsWith(find.toLowerCase()))
	);
}

function findRole(message, find) {
	return (
		message.mentions.roles.first() ||
		message.guild.roles.cache.get(find) ||
		message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(find.toLowerCase()))
	);
}
