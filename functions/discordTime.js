const { Formatters } = require("discord.js");

module.exports = (time, shrt = true, show = true) => {
	if (shrt === true) time = Number((time / 1000).toFixed(0));

	if (show != true) return [Formatters.time(parseInt(time)), Formatters.time(parseInt(time), "R")];
	return `**${Formatters.time(parseInt(time))}** (${Formatters.time(parseInt(time), "R")})`;
};
