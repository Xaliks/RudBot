"use strict";

const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const headers = (node) => new Object({ Authorization: node.password, "Content-Type": "application/json" });

module.exports = class Rest {
	constructor(manager) {
		this.manager = manager;
	}

	async load(identifer) {
		const node = this.manager.idealNodes[0];

		const params = new URLSearchParams();
		params.append("identifier", identifer);

		return await fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, {
			headers: headers(node),
		}).then((resp) => resp.json());
	}

	async decode(tracks) {
		const node = this.manager.idealNodes[0];

		if (Array.isArray(tracks)) {
			return await fetch(`http://${node.host}:${node.port}/decodetracks`, {
				method: "POST",
				body: JSON.stringify(tracks),
				headers: headers(node),
			}).then((resp) => resp.json());
		} else {
			const params = new URLSearchParams();
			params.append("track", tracks);

			return await fetch(`http://${node.host}:${node.port}/decodetrack?${params}`, {
				headers: headers(node),
			}).then((resp) => resp.json());
		}
	}

	async routePlannerStatus() {
		const node = this.manager.idealNodes[0];

		return await fetch(`http://${node.host}:${node.port}/routeplanner/status`, {
			headers,
		}).then((resp) => resp.json());
	}

	async routePlannerUnmark(address) {
		const node = this.manager.idealNodes[0];

		if (address) {
			return await fetch(`http://${node.host}:${node.port}/routeplanner/free/address`, {
				method: "POST",
				body: JSON.stringify({ address }),
				headers: headers(node),
			}).then((resp) => resp.json());
		}
		return await fetch(`http://${node.host}:${node.port}/routeplanner/free/all`, {
			method: "POST",
			headers: headers(node),
		}).then((resp) => resp.json());
	}
};
