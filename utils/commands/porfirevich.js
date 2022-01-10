module.exports = async (interaction, bot) => {
	const { message, user } = interaction;
	const [_, authorId] = interaction.customId.split("-");

	if (user.id != authorId) return interaction.reply({ content: "Ты не можешь использовать это!", ephemeral: true });

	const temp = bot.temp.get(`porfirevich-${authorId}-${message.id}`);
	if (!temp)
		return interaction.reply({
			content: "Бот перезагрузился и не смог сохранить данные об игре! Создайте новую игру!",
			ephemeral: true,
		});
	let [text, generate, gen] = temp;

	interaction.deferUpdate();
	if (interaction.customId.startsWith("porfirevich_reload-")) {
		generate = bot.utils.escapeMarkdown(await gen(text));

		let reply = `${text}**${generate}**`;
		if (reply.length > 3900) reply = "..." + reply.substr(reply.length - 3800);

		message.embeds[0].description = reply;
		message.edit({ embeds: message.embeds });
	}
	if (interaction.customId.startsWith("porfirevich_add")) {
		text += generate;
		generate = bot.utils.escapeMarkdown(await gen(text));

		let reply = `${text}**${generate}**`;
		if (reply.length > 3900) reply = "..." + reply.substr(reply.length - 3800);

		message.embeds[0].description = reply;
		message.edit({ embeds: message.embeds });
	}
	if (interaction.customId.startsWith("porfirevich_delete")) {
		bot.temp.delete(`porfirevich-${authorId}-${message.id}`);
		return message.delete();
	}

	bot.temp.set(`porfirevich-${authorId}-${message.id}`, [text, generate, gen]);
};
