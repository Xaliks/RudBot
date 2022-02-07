const { connect, connection } = require("mongoose");
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
			console.log("[MONGOOSE] Подключение...");
		} catch (error) {
			console.log(`[MONGOOSE] Error: ${JSON.stringify(error)}`);
		}
		connection
			.on("disconnected", () => {
				console.log("[MONGOOSE] Отключение...");
			})
			.on("reconnected", () => {
				console.log("[MONGOOSE] Переподключение...");
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
