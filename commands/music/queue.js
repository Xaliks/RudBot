const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	description: "Музыкальная очередь сервера",
	category: "music",
	cooldown: 15,
	aliases: ["q"],
	async execute(message, args, bot) {
		const queue = bot.music.queues.get(message.guild.id);
		if (!queue) return bot.utils.error("Очередь сервера пуста!", this, message, bot);

		const description = (
			await Promise.all(
				queue.map(async (q, i) => {
					const track = await bot.music.rest.decode(bot.music.idealNodes[0], q.track);

					return `${i + 1}. ***_${queue[i].author.tag}_*  -  [${track.title}](${track.uri})** \`[${msToTime(
						track.length,
					)}]\``;
				}),
			)
		).join("\n");

		return message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle("Очередь сервера")
					.setThumbnail(message.guild.iconURL({ dynamic: true }))
					.setDescription(description),
			],
		});
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
