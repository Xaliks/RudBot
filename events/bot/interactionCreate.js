module.exports = {
	name: "interactionCreate",
	async execute(bot, interaction) {
		const id = interaction.customId;

		if (interaction.isButton() && id.startsWith("porfirevich_")) return bot.interactions.porfirevich(interaction, bot);
		if (interaction.isButton() && id.startsWith("tictactoe_")) return bot.interactions.tictactoe(interaction, bot);
		if (interaction.isButton() && id.startsWith("idea-")) return bot.interactions.idea(interaction, bot);
		if (interaction.isSelectMenu() && id.startsWith("shipbattle-")) return bot.interactions.shipbattle(interaction, bot);
	},
};
