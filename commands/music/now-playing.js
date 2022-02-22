const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "now-playing",
	description: "Что сейчас воспроизводится?",
	category: "music",
	cooldown: 10,
	aliases: ["np", "nowplay", "nowplaying"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (!player || player.queue.length === 0)
			return bot.utils.error("Сейчас ничего не воспроизводится!", this, message, bot);

		const track = player.queue[0].track;

		const emojis = [];
		if (!player.state.playing) emojis.push("⏸️");
		if (player.state.loop) emojis.push("🔁");

		const embed = new MessageEmbed()
			.setAuthor({ name: track.author.name, iconURL: track.author.avatar, url: track.author.url })
			.setTitle(bot.utils.escapeMarkdown(track.title))
			.setURL(track.uri)
			.setThumbnail(track.thumbnail)
			.setFooter({ text: `Громкость ${player.state.volume}%` })
			.addField("Длительность", `\`${msToTime(player.state.position)}\` / \`${msToTime(track.length)}\``, true)
			.addField("Заказал", `${player.queue[0].author} - \`${player.queue[0].author.tag}\``);

		const next = player.queue[1];
		if (next) {
			embed.setDescription(
				`Следующий трек: _\`${next.author.tag}\`_ - **[${bot.utils.escapeMarkdown(next.track.title)}](${
					next.track.uri
				})** [\`${msToTime(next.track.length)}\`]`,
			);
		}

		let content = "Сейчас играет ";
		if (emojis.length > 0) content += emojis.join(" ");

		const msg = await message.reply({ content, embeds: [embed] });

		if (message.guild.me.voice.channelId === message.member.voice?.channelId) player.message = msg;
	},
};

function msToTime(ms) {
	const temp = [];
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / 1000 / 60) % 60);
	const hours = Math.floor(ms / 1000 / 60 / 60);

	if (hours > 0) temp.push(hours.toString().length === 1 ? "0" + hours : hours);
	temp.push(minutes.toString().length === 1 ? "0" + minutes : minutes);
	temp.push(seconds.toString().length === 1 ? "0" + seconds : seconds);

	return temp.join(":");
}
