const { MessageButton } = require("discord.js");

module.exports = {
	name: "divorce",
	description: "Развестись",
	category: "profile",
	cooldown: 60,
	async execute(message, args, bot) {
		const user = await bot.database.member.findOne({ id: message.author.id, guild_id: message.guild.id });
		if (!user || !user.marry) return bot.utils.error("У вас нет пары!", this, message, bot);

		const msg = await message.reply({
			content: "Вы действительно хотите это сделать?",
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
		let success = false;

		collector.on("collect", async (button) => {
			if (button.user.id != user.id) return button.reply({ content: "Ты не можешь это сделать!", ephemeral: true });
			success = true;
			if (msg.deleted) return;
			if (button.customId === "no") {
				collector.stop();
				return button.update({ content: "Действие отменено!", components: [] });
			}

			bot.database.member
				.updateMany({ guild_id: message.guild.id, id: new RegExp(message.author.id + "|" + user.marry) }, { marry: null })
				.then(() => {
					button.update({ content: `Вы развелись с <@${user.marry}>!`, components: [] });
				});
		});

		collector.on("end", () => {
			if (success || msg.deleted) return;

			msg.edit({ content: "Время вышло!", components: [] });
		});
	},
};
