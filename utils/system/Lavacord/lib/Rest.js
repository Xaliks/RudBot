"use strict";

const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const json = (res) => res.json();
module.exports = class Rest {
	static load(node, identifer) {
		const params = new URLSearchParams();
		params.append("identifier", identifer);
		return fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } })
			.then(json);
	}

	static decode(node, tracks) {
		if (Array.isArray(tracks)) {
			return fetch(`http://${node.host}:${node.port}/decodetracks`, {
					method: "POST",
					body: JSON.stringify(tracks),
					headers: { Authorization: node.password },
				})
				.then(json);
		} else {
			const params = new URLSearchParams();
			params.append("track", tracks);
			return fetch(`http://${node.host}:${node.port}/decodetrack?${params}`, { headers: { Authorization: node.password } })
				.then(json);
		}
	}

	static routePlannerStatus(node) {
		return fetch(`http://${node.host}:${node.port}/routeplanner/status`, { headers: { Authorization: node.password } })
			.then(json);
	}

	static routePlannerUnmark(node, address) {
		if (address) {
			return fetch(`http://${node.host}:${node.port}/routeplanner/free/address`, {
					method: "POST",
					body: JSON.stringify({ address }),
					headers: { Authorization: node.password },
				})
				.then(json);
		}
		return fetch(`http://${node.host}:${node.port}/routeplanner/free/all`, {
				method: "POST",
				headers: { Authorization: node.password },
			})
			.then(json);
	}
}
