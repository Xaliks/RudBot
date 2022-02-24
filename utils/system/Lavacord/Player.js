"use strict";

const { EventEmitter } = require("events");
const Track = require("./Track");

module.exports = class Player extends EventEmitter {
	constructor(node, id) {
		super();

		this.node = node;
		this.id = id;
		this.state = { volume: 100, playing: false, loop: 0, position: 0 };
		this.queue = [];
		this.voiceUpdateState = null;

		this.on("event", async (data) => {
			switch (data.type) {
				case "TrackStartEvent":
					this.manager.emit("trackStart", this);
					break;
				case "TrackEndEvent":
					if (data.reason != "REPLACED") {
						if (this.state.loop) {
							this.manager.emit("trackFinished", this);

							if (this.state.loop === 2) this.queue.push(this.queue.shift());

							this._send("play", { track: this.queue[0].track.trackId });
						} else this.skip();
					}
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

	async play(trackId, author) {
		const track = new Track(this.manager, trackId);
		await track.fetch();

		this.queue.push({ track, author });

		if (this.queue.length === 1) return this._send("play", { track: trackId });
	}

	skip() {
		if (this.queue.length === 1) return this.stop();

		this.manager.emit("trackFinished", this);
		if (this.state.loop === 2) this.queue.push(this.queue.shift());
		else this.queue.shift();

		return this._send("play", { track: this.queue[0].track.trackId });
	}

	stop() {
		this.manager.emit("trackFinished", this);

		this.removeAllListeners();
		this.manager.players.delete(this.id);
		this.manager.sendWS(this.id, null);

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

	loop(loop = 0) {
		this.state.loop = loop;

		return this.manager.emit("trackUpdate", this);
	}

	shuffle() {
		const np = this.queue.shift();

		for (let i = this.queue.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));

			[this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
		}

		this.queue.splice(0, 0, np);
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
