module.exports = {
	name: "trackVolume",
	async execute(bot, player, oldVolume, newVolume) {
		const { message } = player.queue[0];

		message.embeds[0].fields[1].value = `**${newVolume}%**`;

		await message.edit({ content: "\n", embeds: message.embeds });
	},
};
