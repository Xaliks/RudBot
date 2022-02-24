const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "loop",
	description: "Включить/Выключить повторение композиции",
	category: "music",
	cooldown: 10,
	usage: ["[queue]"],
	aliases: ["l", "repeat"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (!player || player.queue.length === 0) return bot.utils.error("Очередь сервера пуста!", this, message, bot);
		if (message.guild.me.voice.channelId && message.guild.me.voice.channelId != message.member.voice?.channelId)
			return bot.utils.error(
				`Бота использует кто-то другой! Зайдите в канал <#${message.guild.me.voice.channelId}>!`,
				this,
				message,
				bot,
			);

		if (args[0]?.toLowerCase() === "queue") {
			if (player.state.loop === 2) player.loop(0);
			else player.loop(2);

			return message.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("🎶 Воспроизвение")
						.setDescription(`Очередь ${player.state.loop ? "теперь повторяется" : "больше не повторяется"} 🔁`),
				],
			});
		}

		if (player.state.loop === 1) player.loop(0);
		else player.loop(1);

		return message.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("🎶 Воспроизвение")
					.setDescription(
						`Композиция **${bot.utils.escapeMarkdown(player.queue[0].track.title)}** ${
							player.state.loop ? "теперь повторяется" : "больше не повторяется"
						} 🔂`,
					),
			],
		});
	},
};
