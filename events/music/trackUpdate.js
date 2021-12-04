module.exports = {
	name: "trackUpdate",
	async execute(bot, player) {
		const { state, queue } = player;
		const { message } = queue[0];
		if (message.embeds[0].fields[0].value.includes("р")) return;

		const track = await bot.music.rest.decode(bot.music.idealNodes[0], queue[0].track);

		message.embeds[0].fields[0].value = `\`${msToTime(state.position)}\` ${bar(state.position, track.length, 30, ['[','─︎',']'], ['[','═︎',']'])} \`${msToTime(track.length)}\``
		message.embeds[0].fields[2].value = "**1**";

		await message.edit({ content: "\n", embeds: message.embeds });
	},
};

function bar(standartNum, reqNum, length = 10, standart = ['[', '-', ']'], bar = ['[', '+', ']']) {
    let progressbar = [];
    for (let i = 0; i < length; i++) {
        progressbar[i] = standart[1];
        if (i === 0)
            progressbar[i] = standart[0];
        if (i === length - 1)
            progressbar[i] = standart[2];
    }
    for (let i = 0; i < Math.floor(Math.floor(standartNum / reqNum * 100) / (100 / length)); i++) {
        progressbar[i] = bar[1];
        if (i === 0)
            progressbar[i] = bar[0];
        if (i === length - 1)
            progressbar[i] = bar[2];
    }
    return progressbar.join("")
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
