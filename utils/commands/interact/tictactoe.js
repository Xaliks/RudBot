module.exports = (interaction, bot) => {
	const { message, user } = interaction;
	const [_, authorId, userId] = interaction.customId.split("-");

	if (message.deleted) return;
	if (user.id != authorId && user.id != userId)
		return interaction.reply({ content: "Ты сейчас не играешь!", ephemeral: true });
	if (_ === "tictactoe_x") return message.delete()

	const embed = message.embeds[0];
	let [components, buttons, table, last] = bot.temp.get(`tictactoe-${authorId}-${message.id}`);
	if (last === user.id)
		return interaction.reply({ content: `Сейчас ходит <@${last === authorId ? userId : authorId}>!`, ephemeral: true });

	if (user.id === authorId) {
		buttons
			.find((btn) => btn.customId === interaction.customId)
			.setEmoji("❌")
			.setDisabled(true);
		table[buttons.findIndex((btn) => btn.customId === interaction.customId)] = 0;
	} else {
		buttons
			.find((btn) => btn.customId === interaction.customId)
			.setEmoji("⭕")
			.setDisabled(true);
		table[buttons.findIndex((btn) => btn.customId === interaction.customId)] = 1;
	}

	const winner = checkWinner(table, authorId, userId);
	if (winner) {
		if (winner === "draw") {
			embed.setDescription("Ничья!");
			embed.setColor("ORANGE");
		} else {
			embed.setDescription(`Победил(-а) <@${winner}>!`);
			embed.setColor("GREEN");
		}

		buttons.forEach((b) => {
			b.setDisabled(true);
		});
		bot.temp.delete(`tictactoe-${authorId}-${message.id}`);

		return interaction.update({ embeds: [embed], components: components(buttons) });
	} else {
		last = user.id;
		embed.setDescription(`Ходит: <@${last === authorId ? userId : authorId}>`);
	}

	interaction.update({ embeds: [embed], components: components(buttons) });
	bot.temp.set(`tictactoe-${authorId}-${message.id}`, [components, buttons, table, last]);
};

function checkWinner(t, p, u) {
	if (
		(t[0] == 0 && t[1] == 0 && t[2] == 0) ||
		(t[3] == 0 && t[4] == 0 && t[5] == 0) ||
		(t[6] == 0 && t[7] == 0 && t[8] == 0) ||
		(t[0] == 0 && t[3] == 0 && t[6] == 0) ||
		(t[1] == 0 && t[4] == 0 && t[7] == 0) ||
		(t[2] == 0 && t[5] == 0 && t[8] == 0) ||
		(t[0] == 0 && t[4] == 0 && t[8] == 0) ||
		(t[2] == 0 && t[4] == 0 && t[6] == 0)
	)
		return p;
	if (
		(t[0] == 1 && t[1] == 1 && t[2] == 1) ||
		(t[3] == 1 && t[4] == 1 && t[5] == 1) ||
		(t[6] == 1 && t[7] == 1 && t[8] == 1) ||
		(t[0] == 1 && t[3] == 1 && t[6] == 1) ||
		(t[1] == 1 && t[4] == 1 && t[7] == 1) ||
		(t[2] == 1 && t[5] == 1 && t[8] == 1) ||
		(t[0] == 1 && t[4] == 1 && t[8] == 1) ||
		(t[2] == 1 && t[4] == 1 && t[6] == 1)
	)
		return u;

	if (
		t[0] != undefined &&
		t[1] != undefined &&
		t[2] != undefined &&
		t[3] != undefined &&
		t[4] != undefined &&
		t[5] != undefined &&
		t[6] != undefined &&
		t[7] != undefined &&
		t[8] != undefined
	)
		return "draw";
}
