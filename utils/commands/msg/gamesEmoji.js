const { ActivityType } = require("../../../data/emojis.json");

module.exports = (act) => {
	let emoji = ActivityType[act.type]["null"];
	let other = "";

	for (let activity in ActivityType[act.type]) {
		if (
			activity.toLowerCase().startsWith(act.name.toLowerCase()) ||
			act.name.toLowerCase().startsWith(activity.toLowerCase())
		)
			emoji = ActivityType[act.type][act.name.toLowerCase()];
	}

	if (emoji?.startsWith("<:spotify:") && act.state && act.details) other = `(\`${act.state}\` - \`${act.details}\`)`;

	return `${emoji} ${require("../../../data/user-info.json").ActivityType[act.type]} **${act.name}** ${other}\n`;
};
