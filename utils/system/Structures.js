"use strict";

const Discord = require("discord.js");

module.exports = () => {
	Discord.MessageEmbed = class RudBotMessageEmbed extends Discord.MessageEmbed {
		constructor(data = {}, skipValidation = false) {
			super(data, skipValidation);

			/**
			 * The color of this embed
			 * @type {?number}
			 */
			this.color = Discord.Util.resolveColor("color" in data ? data.color : "303136");
			/**
			 * The timestamp of this embed
			 * @type {?number}
			 */
			this.timestamp = new Date("timestamp" in data ? data.timestamp : Date.now()).getTime();
		}
	};
};
