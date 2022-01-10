const { model, Schema } = require("mongoose");

module.exports = model(
	"Member",
	new Schema({
		id: String,
		guild_id: String,
		reputation: Number,
		gender: String,
		age: Number,
		marry: String,
	}),
);
