"use strict";

const { EventEmitter } = require("events");

module.exports = class Player extends EventEmitter {
	constructor(node, id) {
		super();

		this.node = node;
		this.id = id;
		this.state = { volume: 100 };
		this.queue = [];
		this.playing = false;
		this.voiceUpdateState = null;

		this.on("event", async (data) => {
			switch (data.type) {
				case "TrackStartEvent":
					break;
				case "TrackEndEvent":
					if (data.reason != "STOPPED" && data.reason != "REPLACED") await this.skip();
					break;
				case "TrackExceptionEvent":
					if (this.listenerCount("error")) this.emit("error", data);
					break;
				case "WebSocketClosedEvent":
					if (this.listenerCount("error")) this.emit("error", data);
					break;
				default:
					if (this.listenerCount("warn")) this.emit("warn", `Unexpected event type: ${data.type}`);
					break;
			}
		}).on("playerUpdate", (data) => {
			this.manager.emit("trackUpdate", { ...this, state: { ...this.state, ...data.state } });
		});
	}

	async play(track, author, message) {
		this.queue.push({ track, author, message });

		if (this.queue.length > 1) return;

		this.playing = true;

		return await this.send("play", { track });
	}

	async skip() {
		if (!this.queue[1]) return await this.stop();

		this.manager.emit("trackEnd", this);

		this.queue.shift();
		this.playing = true;

		return await this.send("play", { track: this.queue[0].track });
	}

	async stop() {
		this.manager.emit("trackEnd", this);

		return this.manager.leave(this.id);
	}

	async pause(pause = true) {
		this.playing = !pause;

		return await this.send("pause", { pause });
	}

	async volume(volume) {
		this.state.volume = volume;

		return await this.send("volume", { volume });
	}

	async seek(position) {
		this.state.position = position;

		return await this.send("seek", { position });
	}

	destroy() {
		this.manager.players.delete(this.id);

		return this.send("destroy");
	}

	connect(data) {
		this.voiceUpdateState = data;

		return this.send("voiceUpdate", data);
	}

	switchChannel(channel, options = {}) {
		return this.manager.sendWS(this.id, channel, options);
	}

	send(op, data) {
		if (!this.node.connected) return setTimeout(() => this.send(op, data), 1000);

		return this.node.send({ ...data, op, guildId: this.id });
	}

	get manager() {
		return this.node.manager;
	}
};
