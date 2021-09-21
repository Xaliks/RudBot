const { MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	name: "tictactoe",
	description: "Крестики-нолики",
	category: "commands",
	cooldown: 60,
	aliases: ["ttt", "tic-tac-toe"],
	usage: ["<@Пользователь>"],
	async execute(message, args, bot) {
		const user = bot.utils.findMember(message, args.join(" "))?.user;
		if (!user) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (user.bot) return bot.utils.error("Нельзя играть с ботами!", this, message, bot);
		if (user === message.author) return bot.utils.error("Нельзя играть с собой!", this, message, bot);
		const buttons = [
			new MessageButton().setEmoji("⬛").setCustomId("0").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("1").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("2").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("3").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("4").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("5").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("6").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("7").setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId("8").setStyle(2),
		];
		let t = new Array(9);

		//------------------
		let success = false;
		let msg = await message.channel.send({
			content: `${user}, Вы хотите поиграть в Крестики-нолики с ${message.author}? У вас есть 10 секунд`,
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
		const FirstCollector = msg.createMessageComponentCollector({
			time: 10000,
		});
		let last = user.id;

		FirstCollector.on("collect", async (button) => {
			success = true;

			if (button.user.id != user.id)
				return button.reply({ content: "Ты не можешь нажимать на эту кнопку", ephemeral: true });
			if (button.customId === "no") {
				FirstCollector.stop();
				return message.channel.send(`${user} не захотел играть с вами!`);
			}

			const embed = new MessageEmbed().setTitle("Крестики-Нолики").setDescription(`Ходит: ${message.author}`);
			function components(btns) {
				return [
					{
						type: 1,
						components: [btns[0], btns[1], btns[2]],
					},
					{
						type: 1,
						components: [btns[3], btns[4], btns[5]],
					},
					{
						type: 1,
						components: [btns[6], btns[7], btns[8]],
					},
				];
			}

			msg = await msg.edit({ content: null, embeds: [embed], components: components(buttons) });
			const SecondCollector = msg.createMessageComponentCollector({ time: 60000 });

			SecondCollector.on("collect", (btn) => {
				if (msg.deleted) return;
				if (btn.user.id != user.id && btn.user.id != message.author.id)
					return btn.reply({ content: "Ты сейчас не играешь!", ephemeral: true });
				if (btn.user.id === last) return btn.reply({ content: "Ты не можешь ходить второй раз!", ephemeral: true });
				if (btn.user.id === message.author.id) {
					buttons[Number(btn.customId)].setEmoji("❌").setDisabled(true);
					t[Number(btn.customId)] = 0;
				} else {
					buttons[Number(btn.customId)].setEmoji("⭕").setDisabled(true);
					t[Number(btn.customId)] = 1;
				}

				const winner = checkWinner(t, message.author, user);
				if (winner) {
					if (winner === "draw") {
						embed.setDescription("Ничья!");
						embed.setColor("ORANGE");
					} else {
						embed.setDescription(`Победил(-а) ${winner}`);
						embed.setColor("GREEN");
					}

					buttons.forEach((b) => {
						b.setDisabled(true);
					});
				} else {
					last = btn.user.id;
					embed.setDescription(`Ходит: ${btn.user.id === message.author.id ? user : message.author}`);
				}

				btn.update({ embeds: [embed], components: components(buttons) });
			});

			SecondCollector.on("end", () => {
				if (message.deleted) return;
				if (checkWinner(t, message.author, user)) return;

				embed.setDescription("Время вышло!");
				embed.setColor("RED");
				buttons.forEach((b) => b.setDisabled(true));

				msg.edit({ embeds: [embed], components: components(buttons) });
			});

			FirstCollector.stop();
		});
		FirstCollector.on("end", () => {
			if (success) return;
			message.channel.send("Время вышло!");
		});
	},
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
