const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "trackUpdate",
	async execute(bot, player) {
		if (!player.queue[0] || (player.message.embeds[0].description || "").includes("Трек прослушан")) return;

		const track = await bot.music.rest.decode(player.queue[0].track);
		const video = await getVideoInfo(track.uri);

		const embed = new MessageEmbed()
			.setAuthor({ name: track.author, iconURL: await getAuthorAvatar(video.author_url), url: video.author_url })
			.setTitle((player.playing ? " " : "⏸️") + bot.utils.escapeMarkdown(video.title))
			.setURL(track.uri)
			.setThumbnail(video.thumbnail_url)
			.setFooter({ text: `Громкость ${player.state.volume}%\nПозиция в очереди: 1` })
			.addField("Длительность", `\`${msToTime(player.state.position)}\` / \`${msToTime(track.length)}\``, true)
			.addField("Заказал", `${player.queue[0].author} - \`${player.queue[0].author.tag}\``);

		embed.description = null;

		if (player.queue[1]) {
			const nextTrack = await bot.music.rest.decode(player.queue[1].track);

			embed.setDescription(
				`Следующий трек: _\`${bot.utils.escapeMarkdown(player.queue[1].author.tag)}\`_ - **[${bot.utils.escapeMarkdown(
					nextTrack.title,
				)}](${nextTrack.uri})** \`[${msToTime(track.length)}]\``,
			);
		}

		await player.message.edit({ embeds: [embed] });
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
