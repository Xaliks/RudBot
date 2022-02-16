module.exports = async (message, query, author) => {
	const mention = message.mentions.members.first();
	if (mention) return mention;

	if (query) {
		if (/\d{16,18}/.test(query)) {
			return await message.guild.members
				.fetch({ user: query, force: true, withPresences: true })
				.then((colection) => colection.get ? undefined : colection);
		} else if (/\S+#\d{4}$/.test(query)) {
			return await message.guild.members
				.fetch({ force: true, withPresences: true })
				.then((colection) => colection.find((member) => member.user.tag.toLowerCase() === query.toLowerCase()));
		} else {
			return await message.guild.members
				.fetch({ query, limit: 1, force: true, withPresences: true })
				.then((collection) => collection.first());
		}
	}

	if (author) return message.member;
};
