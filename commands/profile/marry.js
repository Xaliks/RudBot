const { MessageButton } = require("discord.js");

module.exports = {
	name: "marry",
	description: "Пожениться",
	category: "profile",
	cooldown: 120,
	usage: ["<Пользователь>"],
	async execute(message, args, bot) {
		const member = await bot.utils.findMember(message, args.join(" "));
		if (!member) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (member.user.bot) return bot.utils.error("Это бот!", this, message, bot);
		if (member.id === message.author.id) bot.utils.error("Как вы поженитесь на себе?", this, message, bot);

		const author = await bot.cache.create({ id: message.author.id, guild_id: message.guild.id }, "member");
		const user = await bot.cache.create({ id: member.id, guild_id: message.guild.id }, "member");
		const guild = bot.cache.get(message.guild.id);

		if (user.marry) return bot.utils.error("Он(-а) уже состоит в браке!", this, message, bot);
		if (author.marry) return bot.utils.error("Вы уже состоите в браке!", this, message, bot);

		if (!user.gender)
			return bot.utils.error(
				`У ${member} пол **не определён!**
Попросите его/её поставить его командой ${guild.prefix}set-gender ${bot.commands.get("set-gender").usage}`,
				this,
				message,
				bot,
			);

		if (!author.gender)
			return bot.utils.error(
				`Ваш пол **не определён!** 
Вы можете поставить его командой ${guild.prefix}set-gender ${bot.commands.get("set-gender").usage}`,
				this,
				message,
				bot,
			);

		if (user.gender === author.gender) return bot.utils.error("У вас совпадает пол! :eyes:", this, message, bot);

		const msg = await message.reply({
			content: `${member}, Вы хотите вступить в брак с ${message.author}?`,
			components: [
				{
					type: 1,
					components: [
						new MessageButton().setEmoji("✅").setCustomId("yes").setStyle(2),
						new MessageButton().setEmoji("🚫").setCustomId("no").setStyle(2),
					],
				},
			],
		});
		const collector = msg.createMessageComponentCollector({
			time: 10000,
		});

		collector.on("collect", async (button) => {
			if (button.user.id != member.id) return button.reply({ content: "Ты не можешь это сделать!", ephemeral: true });
			if (button.customId === "no") {
				collector.resetTimer(null);
				return button.update({ content: "Действие отменено!", components: [] });
			}

			await bot.cache.update({ id: message.author.id, guild_id: message.guild.id }, { marry: member.id }, "member");
			await bot.cache.update({ id: member.id, guild_id: message.guild.id }, { marry: message.author.id }, "member");

			button.update({ content: `${member} и ${message.author} теперь пара!`, components: [] });
		});

		collector.on("end", (success) => {
			msg.edit({ content: "Время вышло!", components: [] });
		});
	},
};
