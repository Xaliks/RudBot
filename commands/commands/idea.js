const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../config.json");

module.exports = {
	name: "idea",
	description: "Отправить идею **НА СЕРВЕР**",
	cooldown: 120,
	usage: ["<ваша идея>"],
	aliases: ["идея"],
	category: "commands",
	async execute(message, args, bot) {
		if (message.guild.id === "681142809654591501") return;
		const guild = (await bot.database.guild.findOne({ id: message.guild.id })) || { idea_channel: null, prefix };
		const image = message.attachments.map((a) => a)[0]?.attachment || "";

		if (!guild.idea_channel || !message.guild.channels.cache.get(guild.idea_channel))
			return bot.utils.error(
				`Канал для идей не установлен, либо удалён! \`${guild.prefix}set-idea <#канал>\``,
				this,
				message,
				bot,
			);

		message.guild.channels.cache
			.get(guild.idea_channel)
			.send({
				content: `Идея от ${message.author}`,
				embeds: [
					new MessageEmbed()
						.setColor("RANDOM")
						.setTitle("Идея")
						.setAuthor({
							name: message.author.tag,
							iconURL: message.author.displayAvatarURL({
								dynamic: true,
							}),
						})
						.setDescription(args.join(" "))
						.setFooter(`${guild.prefix}${this.name}`)
						.setImage(image),
				],
			})
			.then((m) => {
				m.react("⬆");
				m.react("⬇");
			});

		bot.utils.success(`**Ваша идея:**\n${args.join(" ")}`, message);
	},
};
