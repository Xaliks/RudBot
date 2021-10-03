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
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_0-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_1-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_2-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_3-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_4-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_5-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_6-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_7-${message.author.id}-${user.id}`).setStyle(2),
			new MessageButton().setEmoji("⬛").setCustomId(`tictactoe_8-${message.author.id}-${user.id}`).setStyle(2),
		];

		//------------------
		let success = false;
		const msg = await message.channel.send({
			content: `${user}, Вы хотите поиграть в Крестики-нолики с ${message.author}? У вас есть 15 секунд`,
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
		bot.temp.set(`tictactoe-${message.author.id}-${msg.id}`, [components, buttons, new Array(9), user.id]);
		const collector = msg.createMessageComponentCollector({
			time: 15000,
		});

		collector.on("collect", async (button) => {
			if (button.user.id != user.id)
				return button.reply({ content: "Ты не можешь нажимать на эту кнопку", ephemeral: true });

			success = true;
			if (button.customId === "no") {
				FirstCollector.stop();
				return message.channel.send(`${user} не захотел играть с вами!`);
			}

			await msg.edit({
				content: null,
				embeds: [new MessageEmbed().setTitle("Крестики-Нолики").setDescription(`Ходит: ${message.author}`)],
				components: components(buttons),
			});

			collector.stop();
		});
		collector.on("end", () => {
			if (success) return;
			msg.edit({ content: "Время вышло!", components: [] });
		});
	},
};

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
