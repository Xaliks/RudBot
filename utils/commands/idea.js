module.exports = async (interaction, bot) => {
	const { message, user } = interaction;
	let [_, vote] = interaction.customId.split("-");
	vote = Number(vote);

	const guild = await bot.cache.create({ id: message.guild.id }, "guild");
	const votes = guild.ideas?.messages?.[message.id];

	if (!votes)
		return interaction.reply({
			content: "К сожалению, в базе бота отсутствует данная идея :(",
			ephemeral: true,
		});

	if (votes[user.id] === vote)
		return interaction.reply({
			content: `Вы уже голосовали за ${vote === 0 ? "<:arrowup:914129843254362173>" : "<:arrowdown:914129843271127070>"}`,
			ephemeral: true,
		});

	++message.components[0].components[vote].label;
	if (user.id in votes) --message.components[0].components[vote === 0 ? 1 : 0].label;
	interaction.update({ components: message.components });

	guild.ideas.messages[message.id][user.id] = vote;
	await bot.cache.update({ id: message.guild.id }, guild, "guild");
};
