module.exports = {
	name: "trackFinished",
	async execute(bot, player) {
		player.message.delete().catch(() => null);
	},
};
