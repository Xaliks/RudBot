"use strict";

const { EventEmitter } = require("events");
const LavalinkNode = require("./LavalinkNode");
const Rest = require("./Rest");
const Player = require("./Player");

module.exports = class Manager extends EventEmitter {
	constructor(nodes, options) {
		super();
		this.nodes = new Map();
		this.queues = new Map();
		this.players = new Map();
		this.voiceServers = new Map();
		this.voiceStates = new Map();
		this.shards = 1;
		this.Player = Player;
		this.rest = Rest;
		this.expecting = new Set();

		if (options.user) this.user = options.user;
		if (options.shards) this.shards = options.shards;
		if (options.player) this.Player = options.player;
		if (options.send) this.send = options.send;
		for (const node of nodes) this.createNode(node);
	}

	connect() {
		return Promise.all([...this.nodes.values()].map((node) => node.connect()));
	}

	disconnect() {
		const promises = [];
		for (const id of [...this.players.keys()]) promises.push(this.leave(id));
		for (const node of [...this.nodes.values()]) promises.push(node.destroy());
		
		return Promise.all(promises);
	}

	createNode(options) {
		const node = new LavalinkNode(this, options);
		this.nodes.set(options.id, node);

		return node;
	}

	removeNode(id) {
		const node = this.nodes.get(id);
		if (!node) return false;

		return node.destroy() && this.nodes.delete(id);
	}

	async join(data, joinOptions = {}) {
		const player = this.players.get(data.guild);
		if (player) return player;

		await this.sendWS(data.guild, data.channel, joinOptions);

		return this.spawnPlayer(data);
	}

	async leave(guild) {
		await this.sendWS(guild, null);

		const player = this.players.get(guild);
		if (!player) return false;

		player.removeAllListeners();
		await player.destroy();
		
		return this.players.delete(guild);
	}

	voiceServerUpdate(data) {
		this.voiceServers.set(data.guild_id, data);
		this.expecting.add(data.guild_id);

		return this._attemptConnection(data.guild_id);
	}

	voiceStateUpdate(data) {
		if (data.user_id !== this.user) return Promise.resolve(false);
		if (data.channel_id) {
			this.voiceStates.set(data.guild_id, data);
			return this._attemptConnection(data.guild_id);
		}

		this.voiceServers.delete(data.guild_id);
		this.voiceStates.delete(data.guild_id);
		
		return Promise.resolve(false);
	}

	sendWS(guild, channel, { selfmute = false, selfdeaf = false } = {}) {
		return this.send({
			op: 4,
			d: {
				guild_id: guild,
				channel_id: channel,
				self_mute: selfmute,
				self_deaf: selfdeaf,
			},
		});
	}

	get idealNodes() {
		return [...this.nodes.values()]
			.filter((node) => node.connected)
			.sort((a, b) => {
				const aload = a.stats.cpu ? (a.stats.cpu.systemLoad / a.stats.cpu.cores) * 100 : 0;
				const bload = b.stats.cpu ? (b.stats.cpu.systemLoad / b.stats.cpu.cores) * 100 : 0;
				return aload - bload;
			});
	}

	async _attemptConnection(guildID) {
		const server = this.voiceServers.get(guildID);
		const state = this.voiceStates.get(guildID);
		if (!server || !state || !this.expecting.has(guildID)) return false;

		const player = this.players.get(guildID);
		if (!player) return false;

		await player.connect({ sessionId: state.session_id, event: server });
		this.expecting.delete(guildID);

		return true;
	}

	spawnPlayer(data) {
		const exists = this.players.get(data.guild);
		if (exists) return exists;

		const node = this.nodes.get(data.node);
		if (!node) throw new Error(`INVALID_HOST: No available node with ${data.node}`);

		const player = new this.Player(node, data.guild);
		this.queues.set(data.guild, new Array());
		this.players.set(data.guild, player);
		return player;
	}
};
