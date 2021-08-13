const { MessageEmbed } = require("discord.js");
const { verification } = require("../../data/server-info");
const { emoji } = require("../../data/emojis.json");

module.exports = {
	name: "server-info",
	description: "Инфо о сервере",
	aliases: ["server", "si"],
	cooldown: 10,
	category: "info",
	async execute(message, args, bot) {
		//Даты
		//-----------------------------------------------------------------------------
		let date1 = new Date(message.createdTimestamp);
		let date2 = new Date(message.guild.createdTimestamp);
		let date3 = new Date(message.member.joinedTimestamp);
		const createdAtMS = Math.round(Math.abs(date1.getTime() - date2.getTime()));
		const joinedAtMS = Math.round(Math.abs(date1.getTime() - date3.getTime()));
		const joinedAt = bot.utils.formatDate(date3, "%full");
		const createdAt = bot.utils.formatDate(date2, "%full");
		//-----------------------------------------------------------------------------

		const embed = new MessageEmbed()
			.setAuthor(message.guild.name)
			.setTitle(`Информация о сервере`)
			.setDescription(
				`ID: **${message.guild.id}**
Владелец: **${await message.guild.fetchOwner()}**
Уровень верификации: **${verification[message.guild.verificationLevel]}**
${
	message.guild.afkChannel
		? `AFK канал: **${message.guild.afkChannel.name}** | Тайм-аут: **${bot.utils.time(
				message.guild.afkTimeout * 100,
		  )}**`
		: ""
}`,
			)

			//Участники
			//-----------------------------------------------------------------------------
			.addField(
				`Участников (${bot.utils.formatNumber(message.guild.memberCount)})`,
				`:bust_in_silhouette: Пользователей: **${bot.utils.formatNumber(
					message.guild.members.cache.filter((m) => !m.user.bot).size,
				)}**
${emoji.bot} Ботов: **${bot.utils.formatNumber(
					message.guild.members.cache.filter((m) => m.user.bot).size,
				)}**
${emoji.online} Онлайн: **${get("status", "online")}**
${emoji.offline} Оффлайн: **${get("status", "offline")}**
${emoji.idle} Не актив: **${get("status", "idle")}**
${emoji.dnd} Не беспокоить: **${get("status", "dnd")}**`,
				true,
			)
			//-----------------------------------------------------------------------------

			//Количество
			//-----------------------------------------------------------------------------
			.addField(
				"Количество",
				`:grinning: Кол-во эмодзи: **${message.guild.emojis.cache.size}**
🎭 Кол-во ролей: **${message.guild.roles.cache.size}**
:books: Кол-во категорий: **${get("channel", "GUILD_CATEGORY")}**
:page_facing_up: Кол-во текст. каналов **${get("channel", ["GUILD_TEXT", "GUILD_STORE"])}**
${emoji.voice} Кол-во гол. каналов: **${get("channel", ["GUILD_VOICE", "GUILD_STAGE_VOICE"])}**`,
				true,
			)
			.addField(`⁣⁣⁣⁣`, `⁣`, false)
			//-----------------------------------------------------------------------------

			.setTimestamp()
			.setFooter("Дизайн JeggyBot")
			.setThumbnail(
				message.guild.iconURL({
					dynamic: true,
				}),
			);

		//Если есть бусты
		//-----------------------------------------------------------------------------
		if (message.guild.premiumSubscriptionCount > 0)
			embed.addField(
				`Буст`,
				`${emoji.boost} Уровень буста: **${
					message.guild.premiumTier != "NONE" ? message.guild.premiumTier.slice(5) : 0
				}**
${emoji.boosted} Кол-во бустов: **${message.guild.premiumSubscriptionCount}**`,
				false,
			);
		//-----------------------------------------------------------------------------

		//Даты
		//-----------------------------------------------------------------------------
		embed.addField(`Дата создания`, `${createdAt}\n(**${get("day", createdAtMS)} назад**)`, true);
		embed.addField(`Вы присоединились`, `${joinedAt}\n(**${get("day", joinedAtMS)} назад**)`, true);
		//-----------------------------------------------------------------------------

		message.channel.send({ embeds: [embed] });

		function get(type, data) {
			if (type === "channel") {
				if (typeof data === "string") data = [data];
				return bot.utils.formatNumber(
					data
						.map((d) => message.guild.channels.cache.filter((c) => c.type === d).size)
						.reduce((a, b) => a + b),
				);
			}
			if (type === "day")
				return bot.utils.plural(Math.round(data / (1000 * 60 * 60 * 24)), ["день", "дня", "дней"]);
			if (type === "status")
				return bot.utils.formatNumber(
					message.guild.presences.cache.filter((m) => m.status == data).size,
				);
		}
	},
};
