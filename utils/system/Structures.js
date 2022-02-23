"use strict";

const Discord = require("discord.js");

module.exports.Embed = class Embed extends Discord.MessageEmbed {
	constructor(data = {}, skipValidation = false) {
		super(data, skipValidation);

		this.color = Discord.Util.resolveColor("color" in data ? data.color : "303136");
		this.timestamp = new Date("timestamp" in data ? data.timestamp : Date.now()).getTime();
	}
};
