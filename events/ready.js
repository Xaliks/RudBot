const { events } = require("../config.json");

module.exports = {
	name: "ready",
	execute(bot) {
		require("../utils/other")(bot);
		console.log(events.Bot_ready.replace("{Bot}", bot.user.tag));
	},
};
