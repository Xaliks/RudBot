module.exports = async (message, query, author) => {
	let result = message.mentions.members.first();

	if (!result) {
		query = query.toString().toLowerCase();
		await message.guild.members.fetch({ query, limit: 1, force: true, withPresences: true }).then((collection) => {
			result = collection.first();
		})
	}

	if (!result && author) return message.member;

	return result;
};
