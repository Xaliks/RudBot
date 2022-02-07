const { MessageButton } = require("discord.js");

module.exports = {
	name: "divorce",
	description: "Развестись",
	category: "profile",
	cooldown: 60,
	async execute(message, args, bot) {
		const authorCache = await bot.cache.find({ id: message.author.id, guild_id: message.guild.id }, "member");
		if (!authorCache.marry) return bot.utils.error("У вас нет пары!", this, message, bot);

		const msg = await message.reply({
			content: `Вы действительно хотите развестись с <@${authorCache.marry}>?`,
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
			time: 15000,
		});

		collector.on("collect", async (button) => {
			if (button.user.id != message.author.id)
				return button.reply({ content: "Ты не можешь это сделать!", ephemeral: true });
			if (button.customId === "no") return button.update({ content: "Действие отменено!", components: [] });

			button.update({ content: `Вы развелись с <@${authorCache.marry}>!`, components: [] });

			await bot.cache.delete({ id: authorCache.marry, guild_id: message.guild.id }, "marry", "member");
			await bot.cache.delete({ id: message.author.id, guild_id: message.guild.id }, "marry", "member");
		});
	},
};
