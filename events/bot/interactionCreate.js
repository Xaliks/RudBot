module.exports = {
	name: "interactionCreate",
	async execute(bot, interaction) {
		if (interaction.message.author.id != bot.user.id) return;
		const id = interaction.customId;

		if (id.startsWith("porfirevich_")) return bot.interactions.porfirevich(interaction, bot);
		if (id.startsWith("tictactoe_")) return bot.interactions.tictactoe(interaction, bot);
	},
};
