module.exports = {
	name: "skip",
	description: "Пропустить композицию",
	category: "music",
	aliases: ["s"],
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

        player.skip();

		return bot.utils.success(
			`Композиция **${bot.utils.escapeMarkdown(player.queue[0].track.title)}** была пропущена участником **${bot.utils.escapeMarkdown(message.author.username)}** ⏭️`,
			message,
		);
	},
};
