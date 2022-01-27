const { MessageEmbed, version } = require("discord.js");
const { owners, lavacordNodes } = require("../../config.json");
const os = require("os");

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
**[Пригласить меня](https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot)**`,
					)
					.addField("Статистика", `**Кол-во команд:** \`${bot.commands.filter((cmd) => !cmd.admin).size}\`
**Пользователей:** \`${bot.utils.formatNumber(bot.users.cache.size)}\`
**Серверов:** \`${bot.utils.formatNumber(bot.guilds.cache.size)}\`
**Каналов:** \`${bot.utils.formatNumber(bot.channels.cache.size)}\``, true)
					.addField("Система", `**ОЗУ:** \`${(process.memoryUsage().rss / Math.pow(1024, 2)).toFixed(0)}\`MB / \`${(
		os.totalmem() / Math.pow(1024, 3)
	).toFixed(1)}\`GB
**Node.js** \`${process.version}\`
**Discord.js** \`${version}\`
**OC** \`${os.type()} / ${os.arch()}\``, true)
					.setFooter({ text: `Аптайм: ${bot.utils.time(bot.uptime)}\nПоследняя перезагрузка была:` })
					.setTimestamp(Date.now() - bot.uptime)
					.setThumbnail(bot.user.displayAvatarURL()),
				musicEmbed,
			],
		});
	},
};
