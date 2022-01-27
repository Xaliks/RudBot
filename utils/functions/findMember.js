module.exports = (message, user, author) => {
	const mentions = message.mentions.members.first();
	if (!user || user === "" || user === "@") {
		if (mentions) return mentions;
		if (author) return message.member;
		return undefined;
	}

	user = user.toString().toLowerCase();
	if (!mentions && user.startsWith("@")) user = user.slice(1);

	const ret =
		mentions ||
		message.guild.members.cache.get(user) ||
		message.guild.members.cache.find((m) => m.user.tag.toLowerCase().startsWith(user)) ||
		message.guild.members.cache.find((m) => m.displayName.toLowerCase().startsWith(user));

	if (!ret && author) return message.member;
	return ret;
};
