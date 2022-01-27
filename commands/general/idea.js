const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
	name: "idea",
	description: "Отправить идею **НА СЕРВЕР**",
	cooldown: 3600,
	usage: ["<ваша идея>"],
	category: "general",
	async execute(message, args, bot) {
		const guild = bot.cache.get(message.guild.id);

		if (!guild.ideas || !message.guild.channels.cache.get(guild.ideas.id))
			return bot.utils.error(
				`Канал для идей не установлен, либо удалён! \`${guild.prefix}set-idea ${bot.commands
					.get("set-idea")
					.usage.join(" ")}\``,
				this,
				message,
				bot,
			);

		message.guild.channels.cache
			.get(guild.ideas.id)
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
						.setFooter({ text: `${guild.prefix}${this.name}` })
						.setImage(message.attachments.map((a) => a)[0]?.attachment || ""),
				],
				components: [
					{
						type: 1,
						components: [
							new MessageButton().setStyle(2).setEmoji("914129843254362173").setLabel("0").setCustomId("idea-1"),
							new MessageButton().setStyle(2).setEmoji("914129843271127070").setLabel("0").setCustomId("idea-2"),
						],
					},
				],
			})
			.then(async (msg) => {
				msg.channel.threads.create({ name: "Обсуждение идеи", startMessage: msg.id });

				if (!guild.ideas.ideas) guild.ideas.ideas = new Array();
				guild.ideas.ideas.push({ id: msg.id });

				await bot.cache.delete({ id: message.guild.id }, "idea_channel", "guild");
				await bot.cache.update({ id: message.guild.id }, guild, "guild");
			});

		bot.utils.success(`**Ваша идея:**\n${args.join(" ")}`, message);
	},
};
