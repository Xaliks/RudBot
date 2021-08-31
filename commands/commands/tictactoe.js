const { MessageButton } = require("discord.js");

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
			new MessageButton().setEmoji("🟦").setCustomId("0").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("1").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("2").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("3").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("4").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("5").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("6").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("7").setStyle("PRIMARY"),
			new MessageButton().setEmoji("🟦").setCustomId("8").setStyle("PRIMARY"),
		];
		let t = new Array(9);

		//------------------
		const filter = (m) => m.author.id === user.id;
		let success = false;
		message.channel.send(
			`${user}, Вы хотите поиграть в Крестики-нолики с ${message.author}? (да/нет) У вас есть 15 секунд`,
		);
		const MessageCollect = message.channel.createMessageCollector({
			filter,
			max: 1,
			time: 15000,
		});
		let last = user.id;
		MessageCollect.on("collect", (msgg) => {
			success = true;
			if (!["y", "yes", "д", "да"].includes(msgg.content.split(/ +/g)[0].toLowerCase()))
				return message.channel.send(`${user} не захотел играть с вами!`);
			let content = `Крестики-нолики. У вас есть **1 минута**!
            
Ходит: ${message.author}`;
			message.channel
				.send({
					content: content,
					components: [
						{
							type: 1,
							components: [buttons[0], buttons[1], buttons[2]],
						},
						{
							type: 1,
							components: [buttons[3], buttons[4], buttons[5]],
						},
						{
							type: 1,
							components: [buttons[6], buttons[7], buttons[8]],
						},
					],
				})
				.then((msg) => {
					function edit(btn) {
						btn[btn === msg ? "edit" : "update"]({
							content: content,
							components: [
								{
									type: 1,
									components: [buttons[0], buttons[1], buttons[2]],
								},
								{
									type: 1,
									components: [buttons[3], buttons[4], buttons[5]],
								},
								{
									type: 1,
									components: [buttons[6], buttons[7], buttons[8]],
								},
							],
						});
					}
					const collect = msg.createMessageComponentCollector(
						(m) => m.user.id === message.author.id || m.user.id === user.id,
						{
							time: 60000,
						},
					);

					collect.on("collect", (btn) => {
						if (msg.deleted) return;
						if (last === btn.user.id)
							return btn.reply({
								content: "Ты не можешь ходить второй раз!",
								ephemeral: true,
							});

						if (btn.user.id === message.author.id) {
							buttons[Number(btn.customId)].setEmoji("❌");
							t[Number(btn.customId)] = 0;
						} else {
							buttons[Number(btn.customId)].setEmoji("⭕");
							t[Number(btn.customId)] = 1;
						}

						const winnner = checkWinner(t, message.author, user);
						if (Boolean(winnner)) {
							content = `Крестики-нолики.

${winnner === "draw" ? "Ничья!" : `Победил(-а) ${winnner}`}`;
							buttons.forEach((b) => b.setDisabled(true));
						} else {
							last = btn.user.id;
							content = `Крестики-нолики.
                    
Ходит: ${btn.user.id === message.author.id ? user : message.author}`;

							buttons[Number(btn.customId)].setDisabled(true);
						}
						edit(btn);
					});
					collect.on("end", () => {
						if (msg.deleted) return;
						if (checkWinner(t, message.author, user)) return;
						content = `Крестики-нолики.
                        
Время вышло!`;
						buttons.forEach((b) => b.setDisabled(true));
						edit(msg);
					});
				});
		});
		MessageCollect.on("end", () => {
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
