module.exports = {
	name: "trackEnd",
	async execute(bot, player) {
		player.queue[0].message.embeds[0].fields = [];
		player.queue[0].message.embeds[0].description = "**Трек прослушан**";

		player.queue[0].message.edit({ embeds: player.queue[0].message.embeds });
	},
};
