"use strict";

const Discord = require("discord.js");
const Lavacord = require("lavacord");

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
	Lavacord.LavacordManager = class RudBotLavacordManager extends Lavacord.Manager {
		constructor(bot, nodes) {
			super(nodes, {
				user: bot.user?.id || "675311676354199553",
				shards: bot.options.shardCount || 1
			});

			this.send = (packet) => {
				if (bot.guilds.cache) {
					const guild = bot.guilds.cache.get(packet.d.guild_id);
					if (guild) return guild.shard.send(packet);
				}
			};
	
			bot.ws
				.on("VOICE_SERVER_UPDATE", this.voiceServerUpdate.bind(this))
				.on("VOICE_STATE_UPDATE", this.voiceStateUpdate.bind(this))
				.on("GUILD_CREATE", async data => {
					for (const state of data.voice_states) await this.voiceStateUpdate({ ...state, guild_id: data.id });
				});
		}
	};
};
