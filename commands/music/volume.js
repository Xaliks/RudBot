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
		if (!player || !player.track) return bot.utils.error("Сейчас ничего не играет!", this, message, bot);
		if (!message.member.voice.channel?.members.has(bot.user.id))
			return bot.utils.error("Бот должен быть в одном канале с вами!", this, message, bot);

		const volume = parseInt(args[0]);
		if (isNaN(volume)) return bot.utils.error(`\`${args[0]}\` не число!`, this, message, bot);
		if (player.state.volume === volume) return bot.utils.error("Такая громкость уже стоит!", this, message, bot);
		if (volume > 200) return bot.utils.error("Максимальная громкость может быть не больше `200`%!", this, message, bot);
		if (volume < 0) return bot.utils.error("Минимальная громкость может быть не меньше `1`%!", this, message, bot);

		await player.volume(volume);

		return message.channel.send({
			embeds: [new MessageEmbed().setDescription(`Громкость трека изменена на **${volume}%**`)],
		});
	},
};
