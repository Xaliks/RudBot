const { MessageEmbed, Permissions } = require("discord.js");
const Track = require("../../utils/system/Lavacord/Track");

module.exports = {
	name: "play",
	description: "Воспроизведение композиции в голосовом канале",
	category: "music",
	cooldown: 10,
	usage: ["<Название песни/Ссылка>"],
	aliases: ["p"],
	async execute(message, args, bot) {
		if (!message.member.voice.channelId)
			return bot.utils.error("Вы должны находиться в голосовом канале!", this, message, bot);
		if (
			!message.member.voice.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.CONNECT) ||
			!message.member.voice.channel.permissionsFor(bot.user.id).has(Permissions.FLAGS.SPEAK)
		)
			return bot.utils.error("У меня недостаточно прав (**Входить в канал**, **Говорить**)!", this, message, bot);
		if (message.guild.me.voice.channelId && message.guild.me.voice.channelId != message.member.voice.channelId)
			return bot.utils.error(
				`Бота уже использует кто-то другой! Зайдите в канал <#${message.guild.me.voice.channelId}>!`,
				this,
				message,
				bot,
			);

		let search;
		try {
			search = new URL(args.join(" ")).href;
		} catch (e) {
			search = "ytsearch:" + args.join(" ");
		}
		search = await bot.music.rest.load(search);

		const ftrack = search.tracks?.filter((track) => !track.isStream && track.info.length < 3600000)?.[0];
		if (!ftrack)
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

		const track = new Track(bot.music, ftrack.track);
		await track.fetch();

		const msg = await message.reply({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: track.author.name, iconURL: track.author.avatar, url: track.author.url })
					.setTitle(bot.utils.escapeMarkdown(track.title))
					.setURL(track.uri)
					.setThumbnail(track.thumbnail)
					.setDescription(`[\`${msToTime(track.length)}\`] - **Трек добавлен в очередь**`)
					.setFooter({ text: `Позиция в очереди: ${player.queue.length + 1}` }),
			],
		});

		if (!player.queue.length) player.message = msg;

		await player.play(track.trackId, message.author);
	},
};

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
