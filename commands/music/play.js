const { MessageEmbed, Permissions } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "play",
	description: "Воспроизведение трека в голосовом канале",
	category: "music",
	cooldown: 10,
	usage: ["<Название песни/Ссылка>"],
	aliases: ["p"],
	async execute(message, args, bot) {
		if (!message.member.voice.channelId)
			return bot.utils.error("Вы должны находиться в голосовом канале!", this, message, bot);
		if (
			!message.member.voice.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.CONNECT) ||
			!message.member.voice.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.SPEAK) ||
			!message.member.voice.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.ADMINISTRATOR)
		)
			return bot.utils.error("У меня недостаточно прав (**Входить в канал**, **Говорить**)!", this, message, bot);
		if (message.guild.me.voice.channelId && message.guild.me.voice.channelId != message.member.voice.channelId)
			return bot.utils.error(
				`Бота уже использует кто-то другой! Зайдите в канал <#${message.guild.me.voice.channelId}>!`,
				this,
				message,
				bot,
			);

		const search = await bot.music.rest.load(`ytsearch:${args.join(" ")}`);
		const track = search.tracks?.filter((track) => !track.isStream && track.info.length < 3600000)?.[0];
		if (!track)
			return bot.utils.error(
				`Ничего не найдено в **[YouTube](https://youtube.com)** по запросу \`${args.join(" ")}\`!\n
Длительность видео должно быть меньше часа!`,
				this,
				message,
				bot,
			);

		const player = await bot.music.join({
			guild: message.guild.id,
			channel: message.member.voice.channel.id,
		});
		const video = await getVideoInfo(track.info.uri);

		if (player.queue.length > 0) {
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setAuthor({
							name: track.info.author,
							iconURL: await getAuthorAvatar(video.author_url),
							url: video.author_url,
						})
						.setTitle(bot.utils.escapeMarkdown(video.title))
						.setURL(track.info.uri)
						.setThumbnail(video.thumbnail_url)
						.setDescription("**Трек добавлен в очередь**")
						.setFooter({ text: `Громкость: ${player.state.volume}%\nПозиция в очереди: ${player.queue.length + 1}` })
						.addField("Длительность", `\`${msToTime(track.info.length)}\``, true)
						.addField("Заказал", `${message.author} - \`${message.author.tag}\``, true),
				],
			});

			return await player.play(track.track, message.author);
		}

		const msg = await message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: track.info.author, iconURL: await getAuthorAvatar(video.author_url), url: video.author_url })
					.setTitle(bot.utils.escapeMarkdown(video.title))
					.setURL(track.info.uri)
					.setThumbnail(video.thumbnail_url)
					.setFooter({ text: `Громкость: ${player.state.volume}%\nПозиция в очереди: 1` })
					.addField("Длительность", `\`00:00\` / \`${msToTime(track.info.length)}\``, true)
					.addField("Заказал", `${message.author} - \`${message.author.tag}\``, true),
			],
		});

		await player.play(track.track, message.author, msg);
	},
};

async function getVideoInfo(link) {
	return await fetch(`https://www.youtube.com/oembed?url=${link}&format=json`).then((res) => res.json());
}
async function getAuthorAvatar(url) {
	return await fetch(url)
		.then((resp) => resp.text())
		.then((data) => data.match(/https:\/\/yt3\.ggpht\.com\/.*?"/g)[0].replace('"', ""));
}
function msToTime(ms) {
	const temp = [];
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / 1000 / 60) % 60);
	const hours = Math.floor(ms / 1000 / 60 / 60);

	if (hours > 0) temp.push(hours.toString().length === 1 ? "0" + hours : hours);
	temp.push(minutes.toString().length === 1 ? "0" + minutes : minutes);
	temp.push(seconds.toString().length === 1 ? "0" + seconds : seconds);

	return temp.join(":");
}
