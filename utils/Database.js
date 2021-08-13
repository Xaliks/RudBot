const { connect, connection } = require("mongoose");
const { events } = require("../config.json");

class Model {
	constructor(name) {
		this._name = name;
		this._model = require(`../models/${this._name}`);
	}

	async get(find, createNew = true) {
		const data = await this._model.findOne(find);

		if (!data && createNew) return this.create(find);

		return data;
	}

	async update(find, info, createNew = true) {
		const data = await this._model.findOneAndUpdate(find, info);

		if (!data && createNew) return this.create(new Object({ ...find, ...info }));

		return this.get(find);
	}

	async create(info) {
		const data = new this._model(info);

		await data.save();

		return data;
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
