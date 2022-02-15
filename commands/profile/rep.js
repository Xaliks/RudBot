const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rep",
	description: "Поднять репутацию пользователю",
	category: "profile",
	cooldown: 43200,
	aliases: ["reputation", "+rep"],
	usage: ["<@Пользователь>"],
	async execute(message, args, bot) {
		const member = await bot.utils.findMember(message, args.join(" "));
		if (!member) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (member.user.bot) return bot.utils.error("Это бот. Зачем?", this, message, bot);
		if (member.id === message.author.id) return bot.utils.error("Вы не можете выдать себе репутацию", this, message, bot);

		const User = await bot.cache.find({ id: member.id, guild_id: message.guild.id }, "member");
		const user = await bot.cache.update(
			{ id: member.id, guild_id: message.guild.id },
			{ reputation: User.reputation + 1 },
			"member",
		);

		message.channel.send({
			embeds: [
				new MessageEmbed().setDescription(
					`Вы повысили репутацию ${member}! (\`${user.reputation - 1}\`:star: -> \`${user.reputation}\`:star:)`,
				),
			],
		});
	},
};
