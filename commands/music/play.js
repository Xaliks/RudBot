const { MessageEmbed, MessageButton, Permissions } = require("discord.js");
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

		const query = args.join(" ");
		const search = await bot.music.rest.load(bot.music.idealNodes[0], `ytsearch:${query}`);
		if (!search.tracks[0]) return bot.utils.error(`Ничего не найдено по запросу \`${query}\`!`, this, message, bot);

		const tracks = search.tracks.filter((track) => !track.isStream).slice(0, 5);
		const msg = await message.channel.send({
			embeds: [
				new MessageEmbed().setTitle("Найденные треки").setDescription(
					tracks
						.map((track, i) => {
							return `${i + 1}. **[${bot.utils.escapeMarkdown(track.info.title)}](${track.info.uri})** \`${msToTime(
								track.info.length,
							)}\``;
						})
						.join("\n"),
				),
			],
			components: [
				{
					type: 1,
					components: [
						new MessageButton().setLabel("1").setStyle(2).setCustomId("0"),
						new MessageButton().setLabel("2").setStyle(2).setCustomId("1"),
						new MessageButton().setLabel("3").setStyle(2).setCustomId("2"),
						new MessageButton().setLabel("4").setStyle(2).setCustomId("3"),
						new MessageButton().setLabel("5").setStyle(2).setCustomId("4"),
					],
				},
			],
		});

		const collector = msg.createMessageComponentCollector();
		collector.on("collect", async (button) => {
			if (msg.deleted) return;
			if (button.user.id != message.author.id)
				return button.reply({ content: "Ты не можешь это сделать!", ephemeral: true });
			const track = tracks[button.customId];
			if (Math.floor(track.info.length / 1000 / 60 / 60) >= 1)
				return button.reply({ content: "Запрещено воспроизводить треки длительностью более 1 часа!", ephemeral: true });

			const video = await getVideoInfo(track.info.uri);
			const author_avatar = await getAuthorAvatar(video.author_url);
			const player = await bot.music.join({
				guild: message.guild.id,
				channel: message.member.voice.channel.id,
				node: bot.music.idealNodes[0].id,
			});

			button
				.update({
					content: "\n",
					components: [],
					embeds: [
						new MessageEmbed()
							.setAuthor({ name: track.info.author, iconURL: author_avatar, url: video.author_url })
							.setTitle(bot.utils.escapeMarkdown(video.title))
							.setURL(track.info.uri)
							.setThumbnail(video.thumbnail_url)
							.addField(
								"Длительность",
								`\`00:00\` ${bar(
									player.state.position,
									track.length,
									30,
									["[", "─︎", "]"],
									["[", "═︎", "]"],
								)} \`${msToTime(track.info.length)}\``,
								false,
							)
							.addField("Громкость", `**100%**`, true)
							.addField("Позиция в очереди", `**${player.queue.length || 1}**`, true),
					],
				})
				.then(() => {
					player.play(msg, track.track, message);
				});
		});
	},
};

function getVideoInfo(link) {
	return fetch(`https://www.youtube.com/oembed?url=${link}&format=json`).then((res) => res.json());
}
function getAuthorAvatar(url) {
	return fetch(url)
		.then((resp) => resp.text())
		.then((data) => data.match(/https:\/\/yt3\.ggpht\.com\/.*?"/g)[0].replace('"', ""));
}
function bar(standartNum, reqNum, length = 10, standart = ["[", "-", "]"], bar = ["[", "+", "]"]) {
	let progressbar = [];
	for (let i = 0; i < length; i++) {
		progressbar[i] = standart[1];
		if (i === 0) progressbar[i] = standart[0];
		if (i === length - 1) progressbar[i] = standart[2];
	}
	for (let i = 0; i < Math.floor(Math.floor((standartNum / reqNum) * 100) / (100 / length)); i++) {
		progressbar[i] = bar[1];
		if (i === 0) progressbar[i] = bar[0];
		if (i === length - 1) progressbar[i] = bar[2];
	}
	return progressbar.join("");
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
