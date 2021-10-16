const { ActivityType } = require("../../../data/emojis.json");
const { userinfo } = require("../../../data/data.json");

module.exports = (act) => {
	let emoji = ActivityType[act.type]["null"];
	let other = "";

	if (act.name in ActivityType[act.type]) emoji = ActivityType[act.type][act.name.toLowerCase()];
	if (emoji.startsWith("<:spotify:") && act.state && act.details) other = `(\`${act.state}\` - \`${act.details}\`)`;

	return `${emoji} ${userinfo.ActivityType[act.type]} **${act.name}** ${other}\n`;
};
