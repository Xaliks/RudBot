const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	description: "Музыкальная очередь сервера",
	category: "music",
	cooldown: 15,
	aliases: ["q"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (!player || player.queue.length === 0) return message.channel.send({ content: "Очередь сервера пуста!" });

		const tracks = await bot.music.rest.decode(player.queue.map((t) => t.track));

		return message.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Очередь сервера")
					.setThumbnail(message.guild.iconURL({ dynamic: true }))
					.setDescription(
						tracks
							.map((track, i) => {
								return `${i + 1}. _\`${player.queue[i].author.tag}\`_ -  **[${track.info.title}](${
									track.info.uri
								})** \`[${msToTime(track.info.length)}]\``;
							})
							.join("\n"),
					)
					.setFooter({
						text: `Длительность: ${msToTime(tracks.map((track) => track.info.length).reduce((a, b) => a + b))}`,
					}),
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
