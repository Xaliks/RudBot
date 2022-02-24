const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "resume",
	description: "Возобновить вопроизведение",
	category: "music",
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
		if (player.state.playing) return bot.utils.error("Воспроизведение не приостановлено!", this, message, bot);

		await player.pause();

		return message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle("🎶 Воспроизвение")
					.setDescription(
						`Воспроизведение было возоблено участником **${bot.utils.escapeMarkdown(message.author.username)}** ⏹️`,
					),
			],
		});
	},
};
