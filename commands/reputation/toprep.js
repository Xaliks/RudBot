const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "toprep",
	description: "Топ 10 пользователей по репутации",
	category: "reputation",
	cooldown: 20,
	async execute(message, args, bot) {
		const data = await bot.database.member.get(
			{
				guild_id: message.guild.id,
			},
			{ one: false },
		);

		let description = "";
		let number = 0;
		data
			.sort((a, b) => b.reputation - a.reputation)
			.slice(0, 10)
			.forEach(async (user) => {
				const member = await bot.utils.findMember(message, user.id);

				if (user.reputation != 0 && member)
					description += `\`${++number}\`. **${bot.utils.escapeMarkdown(member.user.tag)}** ${bot.utils.plural(
						user.reputation,
						["очко", "очка", "очков"],
					)}\n`;
			});

		setTimeout(() => {
			if (!description) message.channel.send("На сервере никто не получил репутацию!");
			else
				message.channel.send({
					embeds: [new MessageEmbed().setTitle("Топ по репутации").setDescription(description)],
				});
		}, 400);
	},
};
