module.exports = {
	name: "guildUpdate",
	execute(bot, oldGuild, newGuild) {
		if (oldGuild.id != "681142809654591501") return;

		if (oldGuild.premiumSubscriptionCount > newGuild.premiumSubscriptionCount)
			newGuild.channels.cache
				.get("732618171521040475")
				.send(
					`Кто то перестал бустить сервер :(\n\nКол-во бустов: \`${oldGuild.premiumSubscriptionCount}\` -> \`${newGuild.premiumSubscriptionCount}\``,
				);
		if (oldGuild.premiumTier > newGuild.premiumTier)
			newGuild.channels.cache
				.get("732618171521040475")
				.send(
					`Уровень буста снизился :(\n\nУровень буста: \`${oldGuild.premiumTier}\` -> \`${newGuild.premiumTier}\``,
				);
	},
};
