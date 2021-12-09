const general_roles = {
	news: "733052356564091051",
	ideas: "748859760270639126",
	poll: "733052465246896279",
	youtube: "782549456360177715",
	events: "868244256396029974",
	yellow: "845924211540492329",
	green: "805444779382276126",
	black: "801891098167214160",
	lime: "787636100625596426",
	gray: "759702688186892308",
	white: "759706348014927882",
	pink: "759702741962063883",
	red: "894966869956653096",
};
const staff_roles = {
	staff_green: "793594413317226566",
	staff_pink: "803602083650469888",
	staff_red: "805442959709438024",
	staff_dark: "808351547687305246",
	staff_aqua: "808338239583944704",
};

module.exports = async (interaction) => {
	const added = [];
	const { member, values } = interaction;
	const roles = values.some((value) => value.includes("staff_")) ? staff_roles : general_roles;

	Object.keys(roles).forEach((value) => {
		if (values.includes(value)) {
			added.push(roles[value]);
			member.roles.add(roles[value]);
		} else if (member.roles.cache.has(roles[value])) {
			member.roles.remove(roles[value]);
		}
	});

	interaction.reply({
		content: `Вы взяли: ${
			added.map((a) => `<@&${a}>`).join(" ") || "Ничего"
		}\n\nПодождите несколько секунд. Бот не может выдать все роли так быстро`,
		ephemeral: true,
	});
};
