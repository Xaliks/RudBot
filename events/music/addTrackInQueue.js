module.exports = {
	name: "addTrackInQueue",
	async execute(bot, player) {
		const { queue } = player;
		const n = queue.length - 1;

		const message = queue[n - 1].message;
		const trackMessage = queue[n].message;

		const track = await bot.music.rest.decode(bot.music.idealNodes[0], queue[n].track);

		message.embeds[0].description = `Следующий трек: *${bot.utils.escapeMarkdown(
			queue[n].author.tag,
		)}*: **[${bot.utils.escapeMarkdown(track.title)}](https://discord.com/channels/${trackMessage.guild.id}/${
			trackMessage.channel.id
		}/${trackMessage.id})** \`[${msToTime(track.length)}]\``;

		await message.edit({ content: "\n", embeds: message.embeds });
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
