"use strict";

const WebSocket = require("ws");

module.exports = class LavalinkNode {
	constructor(manager, options) {
		this.manager = manager;
		this.host = options.host || "localhost";
		this.port = options.port || 2333;
		this.reconnectInterval = options.reconnectInterval || 15000;
		this.password = options.password || "youshallnotpass";
		this.ws = null;
		this.stats = {
			players: 0,
			playingPlayers: 0,
			uptime: 0,
			memory: {
				free: 0,
				used: 0,
				allocated: 0,
				reservable: 0,
			},
			cpu: {
				cores: 0,
				systemLoad: 0,
				lavalinkLoad: 0,
			},
		};
		this.resumeTimeout = options.resumeTimeout || 120;
		this._queue = [];
		this.id = options.id;

		if (options.resumeKey) this.resumeKey = options.resumeKey;
	}

	async connect() {
		this.ws = await new Promise((resolve, reject) => {
			if (this.connected) this.ws.close();
			const headers = {
				Authorization: this.password,
				"Num-Shards": String(this.manager.shards || 1),
				"User-Id": this.manager.user,
			};
			if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;
			const ws = new WebSocket(`ws://${this.host}:${this.port}/`, { headers });
			const onEvent = (event) => {
				ws.removeAllListeners();
				reject(event);
			};
			const onOpen = () => {
				this.onOpen();
				ws.removeAllListeners();
				resolve(ws);
			};
			ws.once("open", onOpen).once("error", onEvent).once("close", onEvent);
		});
		this.ws
			.on("message", this.onMessage.bind(this))
			.on("error", this.onError.bind(this))
			.on("close", this.onClose.bind(this));
		return this.ws;
	}

	send(msg) {
		return new Promise((resolve, reject) => {
			const parsed = JSON.stringify(msg);
			const queueData = { data: parsed, resolve, reject };
			if (this.connected) return this._send(queueData);
			else this._queue.push(queueData);
		});
	}

	configureResuming(key, timeout = this.resumeTimeout) {
		return this.send({ op: "configureResuming", key, timeout });
	}

	destroy() {
		if (!this.connected) return false;
		this.ws.close(1000, "destroy");
		this.ws = null;
		return true;
	}

	get connected() {
		if (!this.ws) return false;
		return this.ws.readyState === WebSocket.OPEN;
	}

	onOpen() {
		if (this._reconnect) clearTimeout(this._reconnect);
		this._queueFlush()
			.then(() => {
				if (this.resumeKey) return this.configureResuming(this.resumeKey);
			})
			.catch((error) => this.manager.emit("error", error, this));
		this.manager.emit("ready", this);
	}

	onMessage(data) {
		if (Array.isArray(data)) data = Buffer.concat(data);
		else if (data instanceof ArrayBuffer) data = Buffer.from(data);

		const msg = JSON.parse(data.toString());
		if (msg.op && msg.op === "stats") this.stats = { ...msg };

		delete this.stats.op;
		
		if (msg.guildId && this.manager.players.has(msg.guildId)) this.manager.players.get(msg.guildId).emit(msg.op, msg);
		this.manager.emit("raw", msg, this);
	}

	onError(event) {
		const error = event && event.error ? event.error : event;
		if (!error) return;
		console.log(error)
		console.log(this)
		this.manager.emit("error", error, this);
		this.reconnect();
	}

	onClose(event) {
		this.manager.emit("disconnect", event, this);
		if (event.code !== 1000 || event.reason !== "destroy") return this.reconnect();
	}

	reconnect() {
		this._reconnect = setTimeout(() => {
			this.ws.removeAllListeners();
			this.ws = null;
			this.manager.emit("reconnecting", this);
			this.connect();
		}, this.reconnectInterval);
	}

	_send({ data, resolve, reject }) {
		this.ws.send(data, (error) => {
			if (error) reject(error);
			else resolve(true);
		});
	}

	async _queueFlush() {
		await Promise.all(this._queue.map(this._send));
		this._queue = [];
	}
}