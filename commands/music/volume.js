const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "volume",
	description: "Изменить громкость трека",
	category: "music",
	cooldown: 20,
	usage: ["<Громкость>"],
	aliases: ["v"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (!player || player.queue.length === 0)
			return bot.utils.error("Сейчас ничего не воспроизводится!", this, message, bot);
		if (message.guild.me.voice.channelId && message.guild.me.voice.channelId != message.member.voice?.channelId)
			return bot.utils.error(
				`Бота уже использует кто-то другой! Зайдите в канал <#${message.guild.me.voice.channelId}>!`,
				this,
				message,
				bot,
			);

		const volume = parseInt(args[0]);
		if (isNaN(volume)) return bot.utils.error(`\`${args[0]}\` не число!`, this, message, bot);
		if (volume > 250) return bot.utils.error("Максимальная громкость может быть не больше **250%**!", this, message, bot);
		if (volume < 0) return bot.utils.error("Минимальная громкость может быть не меньше **1%**!", this, message, bot);

		await player.volume(volume);

		return message.channel.send({
			embeds: [new MessageEmbed().setDescription(`Громкость трека изменена на **${volume}%**`)],
		});
	},
};
