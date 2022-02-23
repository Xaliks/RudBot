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

		return message.channel.send({ embeds: [new MessageEmbed().setTitle("🎶 Воспроизвение").setDescription(`Композиция **${bot.utils.escapeMarkdown(player.queue[0].track.title)}** ${
			player.state.loop ? "была зациклена" : "больше не зациклена"
		} участником **${bot.utils.escapeMarkdown(message.author.username)}** 🔁`)] })
	},
};
