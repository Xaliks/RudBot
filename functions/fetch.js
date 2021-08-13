const methods = ["get", "post", "delete", "patch", "put", "options", "head", "trace", "connect"];
const fetch = require("node-fetch");

module.exports = (url) => {
	if (!url) throw new Error("Нужен URL!");
	const resp = {};
	methods.forEach((method) => {
		resp[method] = function (data = {}, json = true) {
			return fetch(url, {
				method,
				...data,
			}).then((resp) => resp[json ? "json" : "text"]());
		};
	});
	return resp;
};
