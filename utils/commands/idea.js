module.exports = async (interaction, bot) => {
	const { message, user } = interaction;
	let [_, vote] = interaction.customId.split("-");
	vote = Number(vote);

	const guild = await bot.cache.create({ id: message.guild.id }, "guild");
	const idea = guild.ideas.ideas.find((idea) => idea.id === message.id);
	const userVote = idea.votes.find((v) => v.id === user.id);

	if (userVote?.vote === vote)
		return interaction.reply({
			content: `Вы уже голосовали за ${vote === 1 ? "<:arrowup:914129843254362173>" : "<:arrowdown:914129843271127070>"}`,
			ephemeral: true,
		});

	message.components[0].components[vote - 1].label = Number(message.components[0].components[vote - 1].label) + 1;
	if (userVote) {
		message.components[0].components[vote === 2 ? 0 : 1].label =
			Number(message.components[0].components[vote === 2 ? 0 : 1].label) - 1;
		guild.ideas.ideas.find((idea) => idea.id === message.id).votes.find((vote) => vote.id === user.id).vote = vote;
	} else guild.ideas.ideas.find((idea) => idea.id === message.id).votes.push({ id: user.id, vote });

	await bot.cache.update({ id: message.guild.id }, guild, "guild");

	interaction.update({ components: message.components, content: message.content, embeds: message.embeds });
};