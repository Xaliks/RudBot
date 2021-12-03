"use strict";

const { EventEmitter } = require("events");

module.exports = class Player extends EventEmitter {
	constructor(node, id) {
		super();
		this.node = node;
		this.id = id;
		this.state = { volume: 100 };
		this.playing = false;
		this.timestamp = null;
		this.paused = false;
		this.track = null;
		this.queue = node.manager.queues.get(id) || [];
		this.voiceUpdateState = null;
		this.on("event", (data) => {
			switch (data.type) {
				case "TrackStartEvent":
					break;
				case "TrackEndEvent":
					this.skip();
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
			if ((this.state.position || 0) != data.state.position)
				this.manager.emit("trackUpdate", {
					...this,
					state: {
						volume: this.state.volume,
						equalizer: this.state.equalizer,
						...data.state,
					},
				});
			this.state = { volume: this.state.volume, equalizer: this.state.equalizer, ...data.state };
		});
	}

	async play(trackMessage, track, message, options = { addInQueue: true }) {
		if (options.addInQueue === true) {
			this.queue.push({ author: message.author, message: trackMessage, track });
			this.manager.queues.set(this.id, this.queue);

			if (this.queue[1]) {
				this.manager.emit("addTrackInQueue", this, this.queue[this.queue.length - 2].message);
				return this.queue;
			}
		}

		const d = await this.send("play", { ...options, track });
		this.track = track;
		this.playing = true;
		this.timestamp = Date.now();

		return d;
	}

	async skip() {
		if (!this.queue[1]) return await this.stop(false);

		this.play(this.queue[1].message, this.queue[1].track, null, { addInQueue: false });
		this.manager.emit("trackStop", this);

		this.queue.shift();
		this.manager.queues.set(this.id, this.queue);

		return true;
	}

	async stop(send = true) {
		if (send) await this.send("stop");

		this.manager.emit("trackStop", this);

		this._deleteQueue();
		this.track = null;
		this.playing = false;
		this.timestamp = null;

		return true;
	}

	async pause(pause = true) {
		this.manager.emit("trackPause", this, pause);

		const d = await this.send("pause", { pause });
		this.paused = pause;
		return d;
	}

	resume() {
		return this.pause(false);
	}

	async volume(volume) {
		this.manager.emit("trackVolume", this, this.state.volume, volume);

		const d = await this.send("volume", { volume });
		this.state.volume = volume;
		return d;
	}

	async seek(position) {
		this.manager.emit("trackSeek", this, this.state.position, position);

		const d = await this.send("seek", { position });
		return d;
	}

	destroy() {
		this._deleteQueue();
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
		if (!this.node.connected) return Promise.reject(new Error("No available websocket connection for selected node."));
		return this.node.send({ ...data, op, guildId: this.id });
	}

	get manager() {
		return this.node.manager;
	}

	_deleteQueue() {
		this.manager.queues.delete(this.id);
		this.queue = [];

		return true;
	}
};
