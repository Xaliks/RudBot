const { model, Schema } = require("mongoose");

module.exports = model(
	"Member",
	new Schema({
		id: {
			type: String,
			required: true,
		},
		guild_id: {
			type: String,
			required: true,
		},
		reputation: {
			type: Number,
			default: 0,
		},
		gender: {
			type: String,
			default: null,
		},
		age: {
			type: Number,
			default: null,
		},
		marry: {
			type: String,
			default: null,
		},
		reminders: {
			type: Object,
			default: {
				hasReminders: false,
				reminders: []
			}
		},
	}),
);
