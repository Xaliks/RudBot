const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "shuffle",
	description: "Перемешать очередь композиций",
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

		player.shuffle();

		return message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle("🎶 Воспроизвение")
					.setDescription(
						`Очередь композиций была перемешана участником **${bot.utils.escapeMarkdown(message.author.username)}** 🔀`,
					),
			],
		});
	},
};
