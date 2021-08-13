const { Util } = require("discord.js");

module.exports = (string) => {
	return Util.escapeMarkdown(String(string));
};
