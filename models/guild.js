const { model, Schema } = require("mongoose");
const { prefix } = require("../config.json");

module.exports = model(
	"Guild",
	new Schema({
		id: String,
		prefix: {
			type: String,
			default: prefix,
		},
		ideas: {
			id: String,
			role: String,
			ideas: [
				{
					id: String,
					votes: undefined | Array,
				},
			],
		},
	}),
);
