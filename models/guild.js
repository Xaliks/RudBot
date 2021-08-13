const { model, Schema } = require("mongoose");
const { prefix } = require("../config.json");

module.exports = model(
	"Guild",
	new Schema({
		id: {
			type: String,
			required: true,
		},
		prefix: {
			type: String,
			default: prefix,
		},
		idea_channel: {
			type: String,
			default: null,
		},
	}),
);
