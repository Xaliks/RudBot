module.exports = {
	name: "messageReactionAdd",
	execute(bot, react, user) {
		if (!react || !user || !react.message) return;
		const { guild, channel } = react.message;
		if (!guild) return;
		if (guild.id != "681142809654591501") return;

		const member = guild.members.cache.get(user.id);
		if (channel.id === "726380912085958727") {
			switch (react.emoji.toString()) {
				case "🔴":
					if (member.roles.cache.has("733052356564091051")) return;
					member.roles.add("733052356564091051");
					break;
				case "🟠":
					if (member.roles.cache.has("733052465246896279")) return;
					member.roles.add("733052465246896279");
					break;
				case "🟢":
					if (member.roles.cache.has("748859760270639126")) return;
					member.roles.add("748859760270639126");
					break;
				case "📢":
					if (member.roles.cache.has("782549456360177715")) return;
					member.roles.add("782549456360177715");
					break;
				case "⚪":
					if (member.roles.cache.has("759706348014927882")) return;
					member.roles.add("759706348014927882");
					break;
				case "⚫":
					if (member.roles.cache.has("759702688186892308")) return;
					member.roles.add("759702688186892308");
					break;
				case "🍅":
					if (member.roles.cache.has("759702741962063883")) return;
					member.roles.add("759702741962063883");
					break;
				case "🥒":
					if (member.roles.cache.has("787636100625596426")) return;
					member.roles.add("787636100625596426");
					break;
				case "👾":
					if (member.roles.cache.has("801891098167214160")) return;
					member.roles.add("801891098167214160");
					break;
				case "🐸":
					if (member.roles.cache.has("805444779382276126")) return;
					member.roles.add("805444779382276126");
					break;
				case "🟡":
					if (member.roles.cache.has("845924211540492329")) return;
					member.roles.add("845924211540492329");
					break;
				case "🆚":
					if (member.roles.cache.has("868244256396029974")) return;
					member.roles.add("868244256396029974");
					break;
				default:
					null;
			}
		} else if (channel.id === "833656341833711656") {
			switch (react.emoji.toString()) {
				case "🐸":
					if (member.roles.cache.has("793594413317226566")) return;
					member.roles.add("793594413317226566");
					break;
				case "🍅":
					if (member.roles.cache.has("803602083650469888")) return;
					member.roles.add("803602083650469888");
					break;
				case "🔴":
					if (member.roles.cache.has("805442959709438024")) return;
					member.roles.add("805442959709438024");
					break;
				case "👾":
					if (member.roles.cache.has("808351547687305246")) return;
					member.roles.add("808351547687305246");
					break;
				case "🔵":
					if (member.roles.cache.has("808338239583944704")) return;
					member.roles.add("808338239583944704");
					break;
				default:
					null;
			}
		}
	},
};
