module.exports = {
	name: "stop",
	description: "Остановить вопроизведение",
	category: "music",
	aliases: ["st"],
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

		player.stop();

		return bot.utils.success(
			`Воспроизведение было остановлено участником **${bot.utils.escapeMarkdown(message.author.username)}** ⏹️`,
			message,
		);
	},
};
