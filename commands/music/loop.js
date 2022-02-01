const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "loop",
	description: "Включить/Выключить повторение композиции",
	category: "music",
	cooldown: 10,
	aliases: ["l"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (!player || player.queue.length === 0)
			return bot.utils.error("Сейчас ничего не воспроизводится!", this, message, bot);
		if (message.guild.me.voice.channelId && message.guild.me.voice.channelId != message.member.voice?.channelId)
			return bot.utils.error(
				`Бота использует кто-то другой! Зайдите в канал <#${message.guild.me.voice.channelId}>!`,
				this,
				message,
				bot,
			);

		player.loop();

		const track = await bot.music.rest.decode(player.queue[0].track);

		return message.reply({
			embeds: [
				new MessageEmbed().setDescription(
					`Композиция **${bot.utils.escapeMarkdown(track.title)}** ${
						player.looping ? "теперь повторяется" : "больше не повторяется"
					} 🔁`,
				),
			],
		});
	},
};
