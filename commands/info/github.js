const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "github",
	description: "Поиск пользователей на github",
	category: "info",
	cooldown: 5,
	usage: ["<Пользователь>"],
	aliases: ["gh"],
	async execute(message, args, bot) {
		const username = args.join(" ");
		const user = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`).then((res) => res.json());

		if (user.message === "Not Found") bot.utils.error("Пользователь не найден!", this, message, bot);

		const twitter = user.twitter_username
			? `[@${user.twitter_username}](https://twitter.com/${user.twitter_username})`
			: "`Отсутствует`";
		const website = user.blog ? user.blog : "`Отсутствует`";
		const location = user.location ? user.location : "Отсутствует";
		const bio = user.bio ? user.bio : "Отсутствует";
		const gmail = user.email ? user.email : "Отсутствует";
		const company = user.company ? user.company : "Отсутствует";

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: bot.utils.escapeMarkdown(user.login), iconURL: user.avatar_url, url: user.html_url })
					.setTitle(`Профиль`)
					.setDescription(
						`**ID:** \`${user.id}\`
**[Аватар](${user.avatar_url})**
**Тип:** \`${user.type}\`
**Компания:** \`${company}\`
**Локация:** \`${location}\`
**Почта:** \`${gmail}\`
**Сайт:** ${website}
**Твиттер:** ${twitter}

**Биография:** \`${bio}\``,
					)
					.addField("Подписчиков:", `**${bot.utils.formatNumber(user.followers)}**`, true)
					.addField("Подписок: ", `**${bot.utils.formatNumber(user.following)}**`, true)
					.addField("\u200b", "\u200b", false)
					.addField("Дата создания", bot.utils.discordTime(data.created_at), true)
					.addField("Аккаунт обновлен ", bot.utils.discordTime(data.updated_at), true)
					.setThumbnail(user.avatar_url),
			],
		});
	},
};
