module.exports = {
	name: "trackFinished",
	async execute(bot, player) {
		if (player.message.deletable) player.message.delete();
	},
};
