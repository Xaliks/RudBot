const { MessageEmbed, version } = require("discord.js");
const { owners, lavacordNodes } = require("../../config.json");
const os = require("os");
const { emojis } = require("../../data/data.json");

module.exports = {
	name: "stats",
	description: "Статистика бота",
	aliases: ["bot", "bot-info"],
	cooldown: 10,
	category: "info",
	async execute(message, args, bot) {
		const musicEmbed = new MessageEmbed().setTitle("Муз. сервера");
		lavacordNodes.forEach((n) => {
			const node = bot.music.nodes.get(n.id);

			musicEmbed.addField(
				n.name,
				`Плееров: \`${node.stats.playingPlayers}\`/\`${node.stats.players}\`
Кол-во ядер ЦП: \`${node.stats.cpu.cores}\`
Использование ОЗУ: **${(node.stats.memory.used / Math.pow(1024, 2)).toFixed(1)}MB**/**${(
					node.stats.memory.allocated / Math.pow(1024, 2)
				).toFixed(1)}MB**`,
				true,
			);
		});

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle("Инфо")
					.setDescription(
						`**Создатель:** \`${bot.utils.escapeMarkdown(await bot.users.fetch(owners[0]).then((owner) => owner.tag))}\`
**Создан:** ${bot.utils.discordTime(bot.user.createdTimestamp, true, false)[0]}
**[Пригласить меня](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)**

**Кол-во команд:** \`${bot.commands.filter((cmd) => !cmd.admin).size}\`
**Пользователей:** \`${bot.utils.formatNumber(bot.users.cache.size)}\`
**Серверов:** \`${bot.utils.formatNumber(bot.guilds.cache.size)}\`
**Каналов:** \`${bot.utils.formatNumber(bot.channels.cache.size)}\`:
(\`${channelSize("GUILD_CATEGORY")}\`кат. / \`${channelSize("GUILD_TEXT")}\`текст. / \`${channelSize(
							"GUILD_VOICE",
						)}\`голос.)

${emojis.CPU}**Кол-во ядер процессора:** \`${os.cpus().length}\`
${emojis.RAM}**Использование ОЗУ:** \`${(process.memoryUsage().rss / Math.pow(1024, 2)).toFixed(0)}\`MB / \`${(
							os.totalmem() / Math.pow(1024, 3)
						).toFixed(1)}\`GB
${emojis.NodeJS}**Версия Node.js:** \`${process.version}\`
${emojis.DiscordJS}**Версия Discord.js:** \`${version}\`
${emojis.Linux}**Операционная система:** \`${os.type()} / ${os.arch()}\``,
					)
					.setFooter(`Аптайм: ${bot.utils.time(bot.uptime)}\nПоследняя перезагрузка была:`)
					.setTimestamp(Date.now() - bot.uptime)
					.setThumbnail(bot.user.displayAvatarURL()),
				musicEmbed,
			],
		});
		function channelSize(ChannelType) {
			return bot.channels.cache.filter((c) => c.type === ChannelType).size;
		}
	},
};
