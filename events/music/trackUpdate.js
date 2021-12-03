module.exports = {
	name: "trackUpdate",
	async execute(bot, player) {
		const { state, queue } = player;
		const { message } = queue[0];
		if (message.embeds[0].fields[0].value.includes("р")) return;

		const track = await bot.music.rest.decode(bot.music.idealNodes[0], queue[0].track);

		message.embeds[0].fields[0].value = `\`${msToTime(state.position)}\` / \`${msToTime(track.length)}\``;
		message.embeds[0].fields[2].value = "**1**";

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
