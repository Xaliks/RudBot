const { connect, connection } = require("mongoose");
const { events } = require("../../config.json");
const db = (name) => {
	const model = require(`../../models/${name}`);

	model.findOneOrCreate = async function (find, create = {}) {
		return (await model.findOne(find)) || (await model.create(new Object({ ...find, ...create })));
	};

	model.updateOneOrCreate = async function (find, update) {
		const updated = await model.updateOne(find, update).catch(() => null);

		if (!updated) await model.create(new Object({ ...find, ...update }));
	};

	return model;
};

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
				this[model] = db(model);
			});
	}
}

module.exports = Database;
