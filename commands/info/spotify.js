const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "spotify",
	description: "Поиск трека/плейлиста/альбома/артиста Spotify",
	category: "info",
	aliases: ["spot"],
	usage: ["<track/artist/album/playlist>", "<запрос>"],
	async execute(message, args, bot) {
		const [type, ...query] = args;
		const data = await fetch(
			`http://api.xaliks.xyz/info/spotify?type=${type}&query=${encodeURIComponent(query.join(" "))}`,
		).then((resp) => resp.json());

		switch (type.toLowerCase()) {
			case "track":
				if (data.error) return bot.utils.error("Трек не найден!", this, message, bot);

				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Инфо о треке ${data.name}`)
							.setURL(data.url)
							.setDescription(
								`Длительность: \`${data.duration}\`
Популярность: \`${data.popularity}\`
Артисты: ${data.artists.map((artist) => `[\`${artist.name}\`](${artist.url})`).join(", ")}

ID: \`${data.id}\`
URI: \`${data.uri}\`
Превью: ${data.preview ? `[\`Ccылка\`](${data.preview})` : "Отсутствует"}`,
							)
							.addField(
								"Альбом",
								`Название: **${data.album.name}**
Дата релиза: ${bot.utils.discordTime(new Date(data.album.release_date).getTime())}
Артисты: ${data.album.artists.map((artist) => `[\`${artist.name}\`](${artist.url})`).join(", ")}`,
								true,
							)
							.setThumbnail(data.album.images[0].url),
					],
				});
				break;

			case "artist":
				if (data.error) return bot.utils.error("Артист не найден!", this, message, bot);
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Инфо об артисте ${data.name}`)
							.setURL(data.url)
							.setDescription(
								`Подписчиков: \`${data.followers}\`
Популярность: \`${data.popularity}\`
Жанры: ${data.genres.map((gen) => `**${gen}**`).join(", ") || "Не указаны"}
Топ 10 треков: ${data.top10tracks.map((track) => `[\`${track.name}\`](${track.url})`).join(", ")}

ID: \`${data.id}\`
URI: \`${data.uri}\``,
							)
							.setThumbnail(data.images[0].url),
					],
				});
				break;

			case "album":
				if (data.error) return bot.utils.error("Альбом не найден!", this, message, bot);
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Инфо об альбоме ${data.name}`)
							.setURL(data.url)
							.setDescription(
								`Дата релиза: ${bot.utils.discordTime(new Date(data.release_date).getTime())}
Всего треков: \`${data.total_tracks}\`
${
	data.total_tracks === 0
		? ""
		: `Топ 15 треков: ${
				data.tracks[0]
					? data.tracks
							.slice(0, 15)
							.map((track) => `[\`${track.name}\`](${track.url})`)
							.join(", ")
					: "`Неизвестно. Spotify не хочет показывать их :(`"
		  }`
}

ID: \`${data.id}\`
URI: \`${data.uri}\``,
							)
							.setThumbnail(data.images[0].url),
					],
				});
				break;

			case "playlist":
				if (data.error) return bot.utils.error("Плейлист не найден!", this, message, bot);
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Инфо о плейлисте ${data.name}`)
							.setURL(data.url)
							.setDescription(
								`Описание: **${data.description || "Отсутствует"}**
Подписчиков: \`${data.followers}\`
Создатель: [\`${data.owner.name}\`](${data.owner.url})
Всего треков: \`${data.total_tracks}\`
${
	data.total_tracks === 0
		? ""
		: `Топ 15 треков: ${
				data.tracks[0]
					? data.tracks
							.slice(0, 15)
							.map((track) => `[\`${track.name}\`](${track.url})`)
							.join(", ")
					: "`Неизвестно. Spotify не хочет показывать их :(`"
		  }`
}

ID: \`${data.id}\`
URI: \`${data.uri}\``,
							)
							.setThumbnail(data.images[0].url),
					],
				});
				break;

			default:
				bot.utils.error(`Неизвестный тип! Доступные типы: \`${this.usage[0]}\``, this, message, bot);
				break;
		}
	},
};
