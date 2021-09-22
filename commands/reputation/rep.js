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
		if (!member) return bot.utils.error("Пользователь не найден!", this, message, bot);
		if (member.user.bot) return bot.utils.error("Это бот. Зачем?", this, message, bot);
		if (member.id === message.author.id)
			return bot.utils.error("Вы не можете выдать себе репутацию", this, message, bot);

		const user = await bot.database.member.db.findOneAndUpdate({ id: member.id, guild_id: message.guild.id }, {
			$inc: {
				reputation: 1,
			}
		}, { upsert: true, returnNewDocument: true }).catch(() => null);

		message.channel.send({
			embeds: [
				new MessageEmbed().setDescription(
					`Вы повысили репутацию ${member}! (\`${user?.reputation || 0}\`:star: -> \`${(user?.reputation || 0) + 1}\`:star:)`,
				),
			],
		});
	},
};
