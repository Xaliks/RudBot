let news = "733052356564091051";
let golos = "733052465246896279";
let idea = "748859760270639126";
let YT = "782549456360177715";
let events = "868244256396029974";

let white = "759706348014927882";
let gray = "759702688186892308";
let pink = "759702741962063883";
let lime = "787636100625596426";
let black = "801891098167214160";
let green = "805444779382276126";
let yellow = "845924211540492329";

module.exports = {
	name: "messageReactionRemove",
	execute(bot, react, user) {
		let { guild, channel } = react.message;
		if (!guild) return;
		if (guild.id != "681142809654591501") return;
		if (channel.id === "726380912085958727") {
			let member = guild.members.cache.get(user.id);
			let e = react.emoji.toString();
			switch (e) {
				case "🔴": //Новости
					if (!member.roles.cache.has(news)) return;
					member.roles.remove(news);
					break;
				case "🟠": //Голосования
					if (!member.roles.cache.has(golos)) return;
					member.roles.remove(golos);
					break;
				case "🟢": //Идеи
					if (!member.roles.cache.has(idea)) return;
					member.roles.remove(idea);
					break;
				case "📢": //ЮТ
					if (!member.roles.cache.has(YT)) return;
					member.roles.remove(YT);
					break;
				case "⚪":
					if (!member.roles.cache.has(white)) return;
					member.roles.remove(white);
					break;
				case "⚫":
					if (!member.roles.cache.has(gray)) return;
					member.roles.remove(gray);
					break;
				case "🍅":
					if (!member.roles.cache.has(pink)) return;
					member.roles.remove(pink);
					break;
				case "🥒": //Лаймовый
					if (!member.roles.cache.has(lime)) return;
					member.roles.remove(lime);
					break;
				case "👾": //Лаймовый
					if (!member.roles.cache.has(black)) return;
					member.roles.remove(black);
					break;
				case "🐸": //Лаймовый
					if (!member.roles.cache.has(green)) return;
					member.roles.remove(green);
					break;
				case "🟡":
					if (!member.roles.cache.has(yellow)) return;
					member.roles.remove(yellow);
					break;
				case "🆚": // Ивенты
					if (!member.roles.cache.has(events)) return;
					member.roles.remove(events);
					break;
				default:
					null;
			}
		} else if (channel.id === "833656341833711656") {
			let member = guild.members.cache.get(user.id);
			let e = react.emoji.toString();
			switch (e) {
				case "🐸": //salat
					if (!member.roles.cache.has("793594413317226566")) return;
					member.roles.remove("793594413317226566");
					break;
				case "🍅": //pink
					if (!member.roles.cache.has("803602083650469888")) return;
					member.roles.remove("803602083650469888");
					break;
				case "🔴": //red
					if (!member.roles.cache.has("805442959709438024")) return;
					member.roles.remove("805442959709438024");
					break;
				case "👾": //dark
					if (!member.roles.cache.has("808351547687305246")) return;
					member.roles.remove("808351547687305246");
					break;
				case "🔵": //aqua
					if (!member.roles.cache.has("808338239583944704")) return;
					member.roles.remove("808338239583944704");
					break;
				default:
					null;
			}
		}
	},
};
