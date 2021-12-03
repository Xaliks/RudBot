module.exports = {
	name: "trackStop",
	async execute(bot, player) {
		const { message } = player.queue[0];

		message.embeds[0].fields = [{ name: "Длительность", value: "**Трек прослушан**" }];

		await message.edit({ content: "\n", embeds: message.embeds });
	},
};
