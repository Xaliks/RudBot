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
	// https://github.com/discordjs/discord.js/pull/6117
	Discord.User = class RudBotUser extends Discord.User {
		constructor(client, data) {
			super(client, data);

			if ("banner" in data) {
				/**
				 * The user banner's hash
				 * <info>The user must be force fetched</info>
				 * @type {?string}
				 */
				this.banner = data.banner;
			} else if (typeof this.banner !== "string") {
				this.banner = null;
			}

			if ("accent_color" in data) {
				/**
				 * The base 10 accent color of the user
				 * <info>The user must be force fetched</info>
				 * @type {?number}
				 */
				this.accentColor = data.accent_color;
			} else if (typeof this.accentColor === "undefined") {
				this.accentColor = null;
			}
		}

		/**
		 * The hexadecimal version of the user accent color, with a leading hash
		 * <info>The user must be force fetched</info>
		 * @type {?string}
		 * @readonly
		 */
		get hexAccentColor() {
			if (!this.accentColor) return null;
			return `#${this.accentColor.toString(16).padStart(6, "0")}`;
		}

		/**
		 * A link to the user's banner.
		 * <info>The user must be force fetched</info>
		 * @param {ImageURLOptions} [options={}] Options for the Image URL
		 * @returns {?string}
		 */
		bannerURL({ format, size, dynamic } = {}) {
			if (!this.banner) return null;
			return this.client.rest.cdn.Banner(this.id, this.banner, format, size, dynamic);
		}

		/**
		 * Checks if the user is equal to another.
		 * It compares id, username, discriminator, avatar, banner, accent color, and bot flags.
		 * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
		 * @param {User} user User to compare with
		 * @returns {boolean}
		 */
		equals(user) {
			let equal =
				user &&
				this.id === user.id &&
				this.username === user.username &&
				this.discriminator === user.discriminator &&
				this.avatar === user.avatar &&
				this.banner === user.banner &&
				this.accentColor === user.accentColor;

			return equal;
		}

		toJSON(...props) {
			const json = super.toJSON(
				{
					createdTimestamp: true,
					defaultAvatarURL: true,
					hexAccentColor: true,
					tag: true,
				},
				...props,
			);
			json.avatarURL = this.avatarURL();
			json.displayAvatarURL = this.displayAvatarURL();
			json.bannerURL = this.bannerURL();
			return json;
		}
	};
};
