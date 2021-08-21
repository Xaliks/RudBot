const { events } = require("../config.json");

module.exports = {
	name: "ready",
	execute(bot) {
		console.log(events.Bot_ready.replace("{Bot}", bot.user.tag));
	},
};
