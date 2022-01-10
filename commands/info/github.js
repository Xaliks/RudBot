const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const types = { User: "Пользователь", Organization: "Организация" };

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

		const data = [];
		if (user.company) data.push(`Компания: **${bot.utils.escapeMarkdown(user.company)}**`);
		if (user.blog) data.push(`Блог: **${bot.utils.escapeMarkdown(user.blog)}**`);
		if (user.location) data.push(`Локация: **${bot.utils.escapeMarkdown(user.location)}**`);
		if (user.email) data.push(`Почта: **${user.email}**`);
		if (user.twitter_username)
			data.push(`Twitter: **[@${user.twitter_username}](https://twitter.com/${user.twitter_username})**`);

		const embed = new MessageEmbed()
			.setAuthor({ name: user.login, url: user.html_url })
			.setThumbnail(user.avatar_url)
			.setTitle(types[user.type] || user.type)
			.setDescription(data.join("\n"))
			.addField(
				"Статистика",
				`Подписчиков: \`${bot.utils.formatNumber(user.followers)}\`
Подписок: \`${bot.utils.formatNumber(user.following)}\`

Публичных репозиториев: \`${bot.utils.formatNumber(user.public_repos)}\`
Публичных Gist'ов: \`${bot.utils.formatNumber(user.public_gists)}\``,
				false,
			)
			.setFooter({ text: `ID: ${user.id}` });

		if (user.bio) embed.addField("Биография", bot.utils.escapeMarkdown(user.bio), false);

		embed
			.addField("Дата создания", bot.utils.discordTime(new Date(user.created_at).getTime()), true)
			.addField("Аккаунт обновлен", bot.utils.discordTime(new Date(user.updated_at).getTime()), true);

		message.channel.send({
			embeds: [embed],
		});
	},
};
