module.exports = {
	name: "interactionCreate",
	async execute(bot, interaction) {
		if (interaction.message.author.id != bot.user.id) return;
		const id = interaction.customId;

		if (id === "ticket_create" && interaction.guildId === "681142809654591501")
			return bot.interactions.tickets(interaction);
		if (id === "ticket_delete" && interaction.guildId === "681142809654591501") {
			if (!interaction.message.channel.name.startsWith("тикет-")) return;

			return interaction.message.channel.delete();
		}
		if (id === "reaction_roles" && interaction.guildId === "681142809654591501")
			return bot.interactions.reaction_roles(interaction);

		if (id.startsWith("porfirevich_")) return bot.interactions.porfirevich(interaction, bot);
		if (id.startsWith("tictactoe_"))
			return bot.interactions.tictactoe(interaction, bot);
	},
};
