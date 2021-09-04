const { connect, connection } = require("mongoose");
const { events } = require("../config.json");

class Model {
	constructor(name) {
		this.db = require(`../models/${name}`);
	}

	async get(find, data = { createNew: true, one: true }) {
		const result = await this.db[data.one ? "findOne" : "find"](find);

		if (!result && data.createNew) return this.create(find);

		return result;
	}

	async update(find, info, createNew = true) {
		const result = await this.db.findOneAndUpdate(find, info);

		if (!result && createNew) return this.create(new Object({ ...find, ...info }));

		return this.get(find);
	}

	async create(info) {
		const result = new this.db(info);

		await result.save();

		return result;
	}
}

class Database {
	constructor(token) {
		try {
			connect(token, {
				useCreateIndex: true,
				useFindAndModify: false,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log(events.Database_connect);
		} catch (error) {
			console.log(events.Database_error.replace("{Error}", error));
		}
		connection
			.on("disconnected", () => {
				console.log(events.Database_disconnect);
			})
			.on("reconnected", () => {
				console.log(events.Database_reconnect);
			});

		require("fs")
			.readdirSync("models")
			.forEach((model) => {
				model = model.split(".js")[0];
				this[model] = new Model(model);
			});
	}
}

module.exports = Database;
