module.exports = {
	name: "trackEnd",
	async execute(bot, player) {
		player.message.embeds[0].fields = [];
		player.message.embeds[0].description = "**Трек прослушан**";

		player.message.edit({ embeds: player.message.embeds });
	},
};
