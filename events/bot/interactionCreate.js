module.exports = {
	name: "interactionCreate",
	async execute(bot, interaction) {
		if (interaction.message.author.id != bot.user.id) return;
		const id = interaction.customId;

		if (id.startsWith("porfirevich_")) return bot.interactions.porfirevich(interaction, bot);
		if (id.startsWith("tictactoe_")) return bot.interactions.tictactoe(interaction, bot);
		if (id.startsWith("idea-")) return bot.interactions.idea(interaction, bot);
		if (id.startsWith("shipbattle-")) return bot.interactions.shipbattle(interaction, bot);
	},
};
