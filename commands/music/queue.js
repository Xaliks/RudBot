const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	description: "Музыкальная очередь сервера",
	category: "music",
	cooldown: 15,
	aliases: ["q"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (player.queue.length === 0) return bot.utils.error("Очередь сервера пуста!", this, message, bot);

		const description = (
			await Promise.all(
				player.queue.map(async (q, i) => {
					const track = await bot.music.rest.decode(q.track);

					return `${i + 1}. _\`${player.queue[i].author.tag}\`_  -  **[${track.title}](${track.uri})** \`[${msToTime(
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
