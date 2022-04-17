const { MessageEmbed, version } = require("discord.js");
const { owners } = require("../../config.json");
const os = require("os");

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
**[Пригласить меня](${bot.generateInvite({ scopes: ["bot"], permissions: 3230976n })})**`,
					)
					.addField(
						"Статистика",
						`**Кол-во команд:** \`${bot.commands.filter((cmd) => !cmd.admin).size}\`
**Пользователей:** \`${bot.utils.formatNumber(bot.users.cache.size)}\`
**Серверов:** \`${bot.utils.formatNumber(bot.guilds.cache.size)}\`
**Каналов:** \`${bot.utils.formatNumber(bot.channels.cache.size)}\``,
						true,
					)
					.addField(
						"Система",
						`**ОЗУ:** \`${(process.memoryUsage().rss / Math.pow(1024, 2)).toFixed(0)}\`MB / \`${(
							os.totalmem() / Math.pow(1024, 3)
						).toFixed(1)}\`GB
**Node.js** \`${process.version}\`
**Discord.js** \`${version}\`
**OC** \`${os.type()} / ${os.arch()}\``,
						true,
					)
					.setFooter({ text: `Аптайм: ${bot.utils.time(bot.uptime)}\nПоследняя перезагрузка была:` })
					.setTimestamp(Date.now() - bot.uptime)
					.setThumbnail(bot.user.displayAvatarURL())
			],
		});
	},
};
