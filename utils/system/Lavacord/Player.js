"use strict";

const { EventEmitter } = require("events");

module.exports = class Player extends EventEmitter {
	constructor(node, id) {
		super();

		this.node = node;
		this.id = id;
		this.state = { volume: 100, playing: false, loop: false, position: 0 };
		this.queue = [];
		this.message = null;
		this.voiceUpdateState = null;

		this.on("event", async (data) => {
			switch (data.type) {
				case "TrackStartEvent":
					this.manager.emit("trackStart", this);
					break;
				case "TrackEndEvent":
					if (this.state.loop) {
						this.manager.emit("trackFinished", this);

						this._send("play", { track: this.queue[0].track });
					} else this.skip();
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
			this.state = { ...this.state, ...data.state };
			this.manager.emit("trackUpdate", this);
		});
	}

	play(track, author) {
		this.queue.push({ track, author });

		if (this.queue.length === 1) return this._send("play", { track });
	}

	skip() {
		if (!this.queue[1]) return this.stop();

		this.manager.emit("trackFinished", this);
		this.queue.shift();

		return this._send("play", { track: this.queue[0].track });
	}

	stop() {
		this.manager.emit("trackFinished", this);

		this.removeAllListeners();
		this.manager.players.delete(this.id);

		return this._send("stop");
	}

	volume(volume) {
		this.state.volume = volume;

		return this._send("volume", { volume });
	}

	seek(position) {
		this.state.position = position;

		return this._send("seek", { position });
	}

	pause() {
		this.state.playing = !this.state.playing;

		return this._send("pause", { pause: !this.state.playing });
	}

	loop() {
		this.manager.emit("trackUpdate", this);

		return (this.state.loop = !this.state.loop);
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
