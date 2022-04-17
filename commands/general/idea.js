const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
	name: "idea",
	description: "Отправить идею **НА СЕРВЕР**",
	cooldown: 3600,
	usage: ["<ваша идея>"],
	category: "general",
	async execute(message, args, bot) {
		if (message.member.roles.cache.has("851520479578816533")) return message.react("❌");

		const guild = bot.cache.get(message.guild.id);

		if (!guild.ideas || !message.guild.channels.cache.get(guild.ideas.id))
			return bot.utils.error(
				`Канал для идей не установлен, либо удалён! \`${guild.prefix}edit-ideas ${bot.commands
					.get("edit-ideas")
					.usage.join(" ")}\``,
				this,
				message,
				bot,
			);

		let role = guild.ideas.role;
		if (role && !message.guild.roles.cache.has(role)) {
			role = null;
			delete guild.ideas.role;
		}

		message.guild.channels.cache
			.get(guild.ideas.id)
			.send({
				content: `${role ? `[ <@&${role}> ]` : ""} Идея от ${message.author}`,
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
							new MessageButton().setStyle(2).setEmoji("914129843254362173").setLabel("0").setCustomId("idea-0"),
							new MessageButton().setStyle(2).setEmoji("914129843271127070").setLabel("0").setCustomId("idea-1"),
						],
					},
				],
			})
			.then(async (msg) => {
				msg.channel.threads.create({ name: "Обсуждение идеи", startMessage: msg.id });

				if (!guild.ideas.messages) guild.ideas.messages = new Object();
				guild.ideas.messages[msg.id] = { [bot.user.id]: 2 };

				delete guild.idea_channel;
				delete guild.ideas.ideas;

				await bot.cache.update({ id: message.guild.id }, guild, "guild");
			});

		bot.utils.success(`**Ваша идея:**\n${args.join(" ")}`, message);
	},
};
