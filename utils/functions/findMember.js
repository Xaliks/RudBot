module.exports = async (message, query, author) => {
	let result = message.mentions.members.first();

	if (!result && query) {
		query = query.toString().toLowerCase();

		if (/\d{16,18}/.test(query)) {
			result = await message.guild.members.fetch({ user: query, force: true, withPresences: true });
		} else
			await message.guild.members.fetch({ query, limit: 1, force: true, withPresences: true }).then((collection) => {
				result = collection.first();
			});
	}

	if (author) {
		if (!query || !result) return message.member;
	}

	return result;
};
