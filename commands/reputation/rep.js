const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rep",
	description: "Поднять репутацию пользователю",
	category: "reputation",
	cooldown: 300,
	aliases: ["reputation"],
	usage: ["<@Пользователь>"],
	async execute(message, args, bot) {
		const member = bot.utils.findMember(message, args.join(" "));
		if (!member) return bot.utils.error("Пользователь не найден!", message);
		if (member.user.bot) return bot.utils.error("Это бот. Зачем?", message);
		if (member.id === message.author.id)
			return bot.utils.error("Вы не можете выдать себе репутацию", message);

		const DBuser = await bot.database.member.get({ id: member.id, guild_id: message.guild.id });
		const rep = DBuser.reputation + 1;

		bot.database.member.update(
			{ id: member.id, guild_id: message.guild.id },
			{
				reputation: rep,
			},
		);
		message.channel.send({
			embeds: [
				new MessageEmbed().setDescription(
					`Вы повысили репутацию ${member}! Теперь у ${
						DBuser.gender === "Female" ? "неё" : "него"
					} \`${rep}\` **${bot.utils.plural(rep, ["очко", "очка", "очков"], false)} репутации**.`,
				),
			],
		});
	},
};
