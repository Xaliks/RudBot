const { MessageEmbed, version } = require("discord.js");
const { owners, botInfo } = require("../../config.json");
const os = require("os");
const { emoji } = require("../../data/emojis.json");

module.exports = {
	name: "stats",
	description: "Статистика бота",
	aliases: ["bot", "bot-info"],
	cooldown: 10,
	category: "info",
	async execute(message, args, bot) {
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle("Инфо")
					.setDescription(
						`**Создатель:** \`${bot.utils.escapeMarkdown(await bot.users.fetch(owners[0]).then((owner) => owner.tag))}\`
**Создан:** ${bot.utils.discordTime(bot.user.createdTimestamp, true, false)[0]}
**Обработано команд:** \`${bot.utils.formatNumber(botInfo.commands)}\`

**Кол-во команд:** \`${bot.commands.filter((cmd) => !cmd.admin).size}\`
**Пользователей:** \`${bot.utils.formatNumber(bot.users.cache.size)}\`
**Серверов:** \`${bot.utils.formatNumber(bot.guilds.cache.size)}\`
**Каналов:** \`${bot.utils.formatNumber(bot.channels.cache.size)}\`:
(\`${channelSize("GUILD_CATEGORY")}\`кат. / \`${channelSize("GUILD_TEXT")}\`текст. / \`${channelSize(
							"GUILD_VOICE",
						)}\`голос.)

${emoji.CPU}**Кол-во ядер процессора:** \`${os.cpus().length}\`
${emoji.RAM}**Использование ОЗУ:** \`${(process.memoryUsage().rss / Math.pow(1024, 2)).toFixed(0)}\`MB / \`${(
							os.totalmem() / Math.pow(1024, 3)
						).toFixed(1)}\`GB
${emoji.NodeJS}**Версия Node.js:** \`${process.version}\`
${emoji.DiscordJS}**Версия Discord.js:** \`${version}\`
${emoji.Linux}**Операционная система:** \`${os.type()} / ${os.arch()}\``,
					)
					.addField(
						"Пригласить меня",
						`[Пригласить меня на свой сервер](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)`,
						false,
					)
					.setFooter(`Аптайм: ${bot.utils.time(bot.uptime)}\nПоследняя перезагрузка была:`)
					.setTimestamp(Date.now() - bot.uptime)
					.setThumbnail(bot.user.displayAvatarURL()),
			],
		});
		function channelSize(ChannelType) {
			return bot.channels.cache.filter((c) => c.type === ChannelType).size;
		}
	},
};
