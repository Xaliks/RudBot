"use strict";

const { EventEmitter } = require("events");

module.exports = class Player extends EventEmitter {
	constructor(node, id) {
		super();

		this.node = node;
		this.id = id;
		this.state = { volume: 100 };
		this.queue = [];
		this.message = null;
		this.playing = false;
		this.looping = false;
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
			if (this.queue[0] && JSON.stringify(this.state) != JSON.stringify(data.state) && this.playing) {
				this.state = { ...this.state, ...data.state };
				this.manager.emit("trackUpdate", this);
			}
		});
	}

	play(track, author, msg) {
		this.queue.push({ track, author });

		if (msg && this.message === null) this.message = msg;
		if (this.queue.length > 1) return;

		this.playing = true;

		return this._send("play", { track });
	}

	skip() {
		if (!this.looping) {
			if (!this.queue[1]) return this.stop();

			this.manager.emit("trackEnd", this);

			this.queue.shift();
			this.playing = true;
		}

		return this._send("play", { track: this.queue[0].track });
	}

	stop() {
		this.manager.emit("trackEnd", this);

		return this.manager.leave(this.id);
	}

	volume(volume) {
		this.state.volume = volume;

		return this._send("volume", { volume });
	}

	seek(position) {
		this.state.position = position;

		return this._send("seek", { position });
	}

	pause(pause = !this.playing) {
		this.playing = pause;

		return this._send("pause", { pause: !pause });
	}

	loop(loop = !this.looping) {
		this.looping = loop;

		return loop;
	}

	destroy() {
		this.manager.players.delete(this.id);

		return this._send("destroy");
	}

	switchChannel(channel, options = {}) {
		return this.manager.sendWS(this.id, channel, options);
	}

	_send(op, data) {
		if (!this.node.connected) return setTimeout(() => this._send(op, data), 1000);

		return this.node.send({ ...data, op, guildId: this.id });
	}

	_connect(data) {
		this.voiceUpdateState = data;

		return this._send("voiceUpdate", data);
	}

	get manager() {
		return this.node.manager;
	}
};
