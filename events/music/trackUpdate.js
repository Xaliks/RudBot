const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "trackUpdate",
	async execute(bot, player) {
		if (player.state.position === 0) return;

		const emojis = [];
		if (!player.state.playing) emojis.push("⏸️");
		if (player.state.loop) emojis.push("🔁");

		const track = await bot.music.rest.decode(player.queue[0].track);
		const video = await getVideoInfo(track.uri);

		const embed = new MessageEmbed()
			.setAuthor({ name: track.author, iconURL: await getAuthorAvatar(video.author_url), url: video.author_url })
			.setTitle(bot.utils.escapeMarkdown(video.title))
			.setURL(track.uri)
			.setThumbnail(video.thumbnail_url)
			.setFooter({ text: `Громкость ${player.state.volume}%` })
			.addField("Длительность", `\`${msToTime(player.state.position)}\` / \`${msToTime(track.length)}\``, true)
			.addField("Заказал", `${player.queue[0].author} - \`${player.queue[0].author.tag}\``);

		const next = player.queue[1];
		if (next) {
			const nextTrack = await bot.music.rest.decode(next.track);

			embed.setDescription(
				`Следующий трек: _\`${next.author.tag}\`_ - **[${bot.utils.escapeMarkdown(nextTrack.title)}](${
					nextTrack.uri
				})** [\`${msToTime(track.length)}\`]`,
			);
		}

		let content = "Сейчас играет ";
		if (emojis.length > 0) content += emojis.join(" ");

		player.message = await player.message.edit({ content, embeds: [embed] });
	},
};

async function getVideoInfo(link) {
	return await fetch(`https://www.youtube.com/oembed?url=${link}&format=json`).then((res) => res.json());
}
async function getAuthorAvatar(url) {
	return await fetch(url)
		.then((resp) => resp.text())
		.then((data) => data.match(/https:\/\/yt3\.ggpht\.com\/.*?"/g)[0].replace('"', ""));
}
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
