const { MessageEmbed, Constants } = require("discord.js");
const { emojis } = require("../../data/data.json");
const verificationLevels = [
	"Отсутствует (0)",
	"Низкий (1)",
	"Средний (2)",
	"Высокий (╯°□°）╯︵  ┻━┻ (3)",
	"Очень высокий ┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻ (4)",
];

module.exports = {
	name: "server-info",
	description: "Инфо о сервере",
	aliases: ["server", "si"],
	cooldown: 10,
	category: "info",
	async execute(message, args, bot) {
		await message.guild.bans.fetch();

		const owner = await bot.users.fetch(message.guild.ownerId).catch(() => null);
		const botCount = message.guild.members.cache.filter((member) => member.user.bot).size;

		const channels = message.guild.channels.cache.filter(
			(channel) => !["GUILD_NEWS_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"].includes(channel.type),
		);
		const categoryChannelCount = channels.filter((channel) => channel.type === "GUILD_CATEGORY").size;
		const voiceChannelCount = channels.filter((channel) => channel.type === "GUILD_VOICE").size;

		const onlineCount = message.guild.presences.cache.filter((pres) => pres.status === "online").size;
		const dndCount = message.guild.presences.cache.filter((pres) => pres.status === "dnd").size;
		const idleCount = message.guild.presences.cache.filter((pres) => pres.status === "idle").size;

		const embed = new MessageEmbed()
			.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
			.setDescription(
				`Владелец: **\`${owner ? owner.tag : "АККАУНТ УДАЛЁН"}\`**
Уровень верификации: **\`${verificationLevels[Constants.VerificationLevels[message.guild.verificationLevel]]}\`**`,
			)
			.addField(
				`Участники [\`${bot.utils.formatNumber(message.guild.memberCount)}\`]`,
				`> Людей: **\`${bot.utils.formatNumber(message.guild.memberCount - botCount)}\`**
> Ботов: **\`${bot.utils.formatNumber(botCount)}\`**


> ${emojis.online}Онлайн: **\`${bot.utils.formatNumber(onlineCount)}\`**
> ${emojis.dnd}Не беспокоить: **\`${bot.utils.formatNumber(dndCount)}\`**
> ${emojis.idle}Нет на месте: **\`${bot.utils.formatNumber(idleCount)}\`**
> ${emojis.offline}Оффлайн: **\`${bot.utils.formatNumber(
					message.guild.memberCount - onlineCount - dndCount - idleCount,
				)}\`**`,
				true,
			)
			.addField(
				`Каналы [\`${channels.size}\`]`,
				`> Категорий: **\`${categoryChannelCount}\`**
> Текстовых каналов: **\`${channels.size - categoryChannelCount - voiceChannelCount}\`**
> Голосовых каналов: **\`${voiceChannelCount}\`**

> 🔨Банов: **\`${bot.utils.formatNumber(message.guild.bans.cache.size)}\`**
> 🤩Эмодзи: **\`${message.guild.emojis.cache.size}\`**
> 🎭Ролей: **\`${message.guild.roles.cache.size}\`**`,
				true,
			)
			.setThumbnail(
				message.guild.iconURL({
					dynamic: true,
					size: 2048,
				}),
			)
			.setFooter({ text: `ID: ${message.guild.id}` });

		if (message.guild.premiumSubscriptionCount > 0)
			embed.addField(
				`Буст`,
				`Уровень буста: **\`${Constants.PremiumTiers[message.guild.premiumTier]}\`**
Кол-во бустов: **\`${message.guild.premiumSubscriptionCount}\`**`,
				false,
			);
		else embed.addField(`⁣⁣⁣⁣`, `⁣`, false);

		embed
			.addField(`Дата создания`, bot.utils.discordTime(message.guild.createdTimestamp), true)
			.addField(`Вы присоединились`, bot.utils.discordTime(message.member.joinedTimestamp), true);

		message.channel.send({ embeds: [embed] });
	},
};
