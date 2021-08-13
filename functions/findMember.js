module.exports = (message, user, author) => {
	if (!user || user === "" || user === "@") {
		if (author) return message.member;
		return undefined;
	}

	user = user.toString().toLowerCase()
	if (!message.mentions.members.first() && user.startsWith("@")) user = user.slice(1);

	const ret =
		message.mentions.members.first() ||
		message.guild.members.cache.get(user) ||
		message.guild.members.cache.find((m) => m.user.tag.toLowerCase().startsWith(user)) ||
		message.guild.members.cache.find((m) => m.user.username.toLowerCase().startsWith(user)) ||
		message.guild.members.cache.find((m) => m.displayName.toLowerCase().startsWith(user));

	if (!ret && author) return message.member;
	return ret;
};
