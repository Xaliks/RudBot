const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "trackStart",
	async execute(bot, player) {
		const track = player.queue[0].track;

		const emojis = [];
		if (player.state.loop) emojis.push("🔁");

		const embed = new MessageEmbed()
			.setAuthor({ name: track.author.name, iconURL: track.author.avatar, url: track.author.url })
			.setTitle(bot.utils.escapeMarkdown(track.title))
			.setURL(track.uri)
			.setThumbnail(track.thumbnail)
			.setFooter({ text: `Громкость ${player.state.volume}%` })
			.addField("Длительность", `\`00:00\` / \`${msToTime(track.length)}\``, true)
			.addField("Заказал", `${player.queue[0].author} - \`${player.queue[0].author.tag}\``);

		const next = player.queue[1];
		if (next) {
			embed.setDescription(
				`Следующий трек: _\`${next.author.tag}\`_ - **[${bot.utils.escapeMarkdown(next.track.title)}](${
					next.track.uri
				})** [\`${msToTime(track.length)}\`]`,
			);
		}

		let content = "Сейчас играет ";
		if (emojis.length > 0) content += emojis.join(" ");

		player.state.playing = true;
		player.message = await player.message.channel.send({ content, embeds: [embed] });
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
