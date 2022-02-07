const { MessageButton } = require("discord.js");

module.exports = {
	name: "reset-rep",
	description: "Обнулить рeпутацию на сервере",
	category: "settings",
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

		collector.on("collect", async (button) => {
			if (button.user.id != message.author.id)
				return button.reply({ content: "Ты не можешь это сделать!", ephemeral: true });
			success = true;
			if (msg.deleted) return;
			if (button.customId === "no") return button.update({ content: "Действие отменено!", components: [] });

			const members = bot.cache.search(`_${message.guild.id}`);
			for (let i = 0; i < members.length; ++i) {
				const value = members[i][1];

				if (value.reputation === 0) continue;

				value.reputation = 0;
				bot.cache.set(members[i][0], value);
			}

			bot.database.member
				.updateMany({ guild_id: message.guild.id, reputation: { $ne: 0 } }, { reputation: 0 })
				.then((result) => {
					if (result.n === 0) return button.update({ content: "На сервере никто не получал репутацию!", components: [] });
					button.update({ content: "Репутация была успешно сброшена!", components: [] });
				});
		});
	},
};
