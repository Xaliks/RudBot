const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../config.json");

/**
 * TODO: Сделать открытие треда (+ настройка для этого)
 */
module.exports = {
	name: "idea",
	description: "Отправить идею **НА СЕРВЕР**",
	cooldown: 120,
	usage: ["<ваша идея>"],
	aliases: ["идея"],
	category: "commands",
	async execute(message, args, bot) {
		const guild = (await bot.database.guild.findOne({ id: message.guild.id })) || { idea_channel: null, prefix };
		const image = message.attachments.map((a) => a)[0]?.attachment || "";

		if (!guild.idea_channel || !message.guild.channels.cache.get(guild.idea_channel))
			return bot.utils.error(
				`Канал для идей не установлен, либо удалён! \`${guild.prefix}set-idea <#канал>\``,
				this,
				message,
				bot,
			);

		if (message.member.roles.cache.has("851520479578816533"))
			return bot.utils.error(`Клоун, тебе нельзя писать идеи!`, this, message, bot);

		message.guild.channels.cache
			.get(guild.idea_channel)
			.send({
				content: `${message.guild.id === "681142809654591501" ? "<@&748859760270639126>, " : ""}Идея от ${
					message.author
				}`,
				embeds: [
					new MessageEmbed()
						.setColor("RANDOM")
						.setTitle("Идея")
						.setAuthor(
							message.author.tag,
							message.author.displayAvatarURL({
								dynamic: true,
							}),
						)
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
