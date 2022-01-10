const { MessageEmbed } = require("discord.js");
const { serverinfo, emojis } = require("../../data/data.json");

/**
 * TODO: Оптимизировать все что можно
 */
module.exports = {
	name: "server-info",
	description: "Инфо о сервере",
	aliases: ["server", "si"],
	cooldown: 10,
	category: "info",
	async execute(message, args, bot) {
		let bots = (users = online = offline = idle = dnd = categories = text = voices = 0);

		message.guild.members.cache.each((mem) => {
			if (mem.user.bot) ++bots;
			else ++users;
		});
		message.guild.presences.cache.each((pres) => {
			if (pres.status === "online") ++online;
			else if (pres.status === "offline") ++offline;
			else if (pres.status === "idle") ++idle;
			else ++dnd;
		});
		message.guild.channels.cache.each((channel) => {
			if (channel.type === "GUILD_CATEGORY") ++categories;
			else if (["GUILD_TEXT", "GUILD_STORE"].includes(channel.type)) ++text;
			else ++voices;
		});

		const embed = new MessageEmbed()
			.setAuthor({ name: message.guild.name })
			.setTitle(`Информация о сервере`)
			.setDescription(
				`ID: **${message.guild.id}**
Владелец: <@${message.guild.ownerId}>
Уровень верификации: **${serverinfo.verification[message.guild.verificationLevel]}**
AFK канал: **${message.guild.afkChannel || "Не установлен"}**`,
			)

			.addField(
				`Участников (${bot.utils.formatNumber(message.guild.memberCount)})`,
				`:bust_in_silhouette: Пользователей: **${bot.utils.formatNumber(users)}**
${emojis.bot} Ботов: **${bot.utils.formatNumber(bots)}**
${emojis.online} Онлайн: **${bot.utils.formatNumber(online)}**
${emojis.offline} Оффлайн: **${bot.utils.formatNumber(offline)}**
${emojis.idle} Не актив: **${bot.utils.formatNumber(idle)}**
${emojis.dnd} Не беспокоить: **${bot.utils.formatNumber(dnd)}**`,
				true,
			)

			.addField(
				"Количество",
				`:grinning: Кол-во эмодзи: **${message.guild.emojis.cache.size}**
🎭 Кол-во ролей: **${message.guild.roles.cache.size}**
:books: Кол-во категорий: **${categories}**
:page_facing_up: Кол-во текст. каналов **${text}**
${emojis.voice} Кол-во голос. каналов: **${voices}**`,
				true,
			)
			.addField(`⁣⁣⁣⁣`, `⁣`, false)
			.setFooter({ text: "Дизайн JeggyBot" })
			.setThumbnail(
				message.guild.iconURL({
					dynamic: true,
				}),
			);

		if (message.guild.premiumSubscriptionCount > 0)
			embed.addField(
				`Буст`,
				`${emojis.boost} Уровень буста: **${serverinfo.premiumTiers[message.guild.premiumTier]}**
${emojis.boosted} Кол-во бустов: **${message.guild.premiumSubscriptionCount}**`,
				false,
			);

		embed
			.addField(`Дата создания`, bot.utils.discordTime(message.guild.createdTimestamp), true)
			.addField(`Вы присоединились`, bot.utils.discordTime(message.member.joinedTimestamp), true);

		message.channel.send({ embeds: [embed] });
	},
};
