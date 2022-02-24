const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	description: "Музыкальная очередь сервера",
	category: "music",
	cooldown: 15,
	aliases: ["q"],
	async execute(message, args, bot) {
		const player = bot.music.players.get(message.guild.id);
		if (!player || player.queue.length === 0) return bot.utils.error("Очередь сервера пуста!", this, message, bot);

		const content = "_ _";
		if (!player.state.playing) content += "⏸️";
		if (player.state.loop === 1) content += "🔂";
		if (player.state.loop === 2) content += "🔁";

		return message.reply({
			content,
			embeds: [
				new MessageEmbed()
					.setTitle("Очередь сервера")
					.setThumbnail(message.guild.iconURL({ dynamic: true }))
					.setDescription(
						player.queue
							.map((q, i) => {
								return `${i + 1}. _\`${q.author.tag}\`_ -  **[${q.track.title}](${q.track.uri})** \`[${msToTime(
									q.track.length,
								)}]\``;
							})
							.join("\n"),
					)
					.setFooter({
						text: `Длительность: ${msToTime(player.queue.map((q) => q.track.length).reduce((a, b) => a + b))}`,
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
