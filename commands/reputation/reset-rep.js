const { MessageButton } = require("discord.js");

module.exports = {
	name: "reset-rep",
	description: "Обнулить рeпутацию на сервере",
	category: "reputation",
	cooldown: 60,
	aliases: ["resetrep"],
	userPerms: ["MANAGE_GUILD"],
	async execute(message, args, bot) {
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
			if (button.user.id != message.author.id)
				return button.reply({ content: "Ты не можешь это сделать!", ephemeral: true });
			success = true;
			if (msg.deleted) return;
			if (button.customId === "no") {
				collector.stop();
				return button.update({ content: "Действие отменено!", components: [] });
			}

			bot.database.member
				.updateMany({ guild_id: message.guild.id, reputation: { $ne: 0 } }, { reputation: 0 })
				.then((result) => {
					if (result.n === 0) {
						collector.stop();
						return button.update({ content: "На сервере никто не получал репутацию!", components: [] });
					}
					button.update({ content: "Репутация была успешно сброшена!", components: [] });
				});
		});

		collector.on("end", () => {
			if (success || msg.deleted) return;

			msg.edit({ content: "Время вышло!", components: [] });
		});
	},
};
