"use strict";

const Discord = require("discord.js");

module.exports.Embed = class Embed extends Discord.MessageEmbed {
	constructor(data = {}, skipValidation = false) {
		super(data, skipValidation);

		this.color = Discord.Util.resolveColor("color" in data ? data.color : "303136");
		this.timestamp = new Date("timestamp" in data ? data.timestamp : Date.now()).getTime();
	}
};

module.exports.MusicManager = class MusicManager extends require("./Lavacord/Manager.js") {
	constructor(bot, nodes) {
		super(bot, nodes);

		this.send = (packet) => {
			bot.guilds.cache.get(packet.d.guild_id).shard.send(packet);
		};

		bot.ws
			.on("VOICE_SERVER_UPDATE", this.voiceServerUpdate.bind(this))
			.on("VOICE_STATE_UPDATE", this.voiceStateUpdate.bind(this))
			.on("GUILD_CREATE", async (data) => {
				for (const state of data.voice_states) await this.voiceStateUpdate({ ...state, guild_id: data.id });
			});

		bot
			.on("voiceStateUpdate", (oldState, newState) => {
				const newMember = newState.member;

				if (!oldState.channel && newState.channel) {
					bot.emit("voiceChannelJoin", newMember, newState.channel);
				}

				if (oldState.channel && !newState.channel) {
					bot.emit("voiceChannelLeave", newMember, oldState.channel);
				}

				if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
					bot.emit("voiceChannelLeave", newMember, oldState.channel);
					bot.emit("voiceChannelJoin", newMember, newState.channel);
				}
			})
			.on("voiceChannelLeave", async (member, channel) => {
				if (channel.members.size === 1 && channel.members.has(bot.user.id)) {
					await this.sendWS(channel.guild.id, null);

					const player = this.players.get(channel.guild.id);
					if (!player) return;

					await player.destroy();

					return this.players.delete(channel.guild.id);
				}
			});
	}
};
