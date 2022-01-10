const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

/**
 * TODO: Переписать здесь ВСЁ
 */
module.exports = {
	name: "minecraft",
	description: "Инфо о minecraft сервере",
	usage: ["<IP сервера>"],
	cooldown: 10,
	category: "info",
	aliases: ["майнкрафт", "мсервер"],
	async execute(message, args, bot) {
		const IP = args[0];
		const data = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(IP)}`).then((res) => res.json());
		if (data.ip === "") return bot.utils.error("IP не найден!", this, message, bot);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`Информация о minecraft сервере`)
					.setDescription(
						`Онлайн? **${data.online ? "Да" : "Нет"}**

**IP:** **${data.ip} ${data.hostname ? `/ ${data.hostname}` : ""}**
**Порт:** **${data.port}**
${
	data.online
		? `**Игроков:** \`${bot.utils.formatNumber(data.players.online)}\` **/** \`${bot.utils.formatNumber(
				data.players.max,
		  )}\`
**Версия:** **${data.version}**

${
	data.motd.clean
		? `**Описание:**
\`${bot.utils.escapeMarkdown(data.motd.clean)}\``
		: ""
}`
		: ""
}`,
					)
					.setThumbnail(data.online ? `https://api.mcsrvstat.us/icon/${IP}` : ""),
			],
		});
	},
};
