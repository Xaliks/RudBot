const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "minecraft",
	description: "Инфо о minecraft сервере",
	usage: ["<IP сервера>"],
	cooldown: 10,
	category: "info",
	aliases: ["майнкрафт", "мсервер"],
	async execute(message, args, bot) {
		const data = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(args.join(""))}`)
			.then((res) => res.json())
			.catch(() => null);
		if (!data)
			return bot.utils.error("Ошибка со стороны [API](https://mcsrvstat.us)! Попробуйте позже", this, message, bot);
		if (data.ip === "" || data.ip === "127.0.0.1") return bot.utils.error("IP не найден!", this, message, bot);

		const embed = new MessageEmbed()
			.setAuthor({
				name: `${data.hostname ? data.hostname + " | " : ""} ${data.ip}:${data.port}`,
				iconURL: `https://cdn.discordapp.com/emojis/${data.online ? "936319696058339348" : "784420488436514856"}.png`,
			})
			.setThumbnail(`https://api.mcsrvstat.us/icon/${args.join("")}`)
			.setDescription("**СЕРВЕР ОФФЛАЙН**");

		if (data.online) {
			embed.description = `**Игроков: [\`${bot.utils.formatNumber(data.players?.online || 0)}\`/\`${bot.utils.formatNumber(
				data.players?.max || 0,
			)}\`]**`;

			if (data.motd) embed.description += `\`\`\`\n${data.motd?.clean.join("\n") || ""}\`\`\``;

			embed.setFooter({ text: "Версия: " + data.version });
		}

		message.channel.send({
			embeds: [embed],
		});
	},
};
