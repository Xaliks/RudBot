const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "toprep",
	description: "Топ 10 пользователей по репутации",
	category: "reputation",
	cooldown: 20,
	async execute(message, args, bot) {
		const members = await bot.database.member.find({ guild_id: message.guild.id, reputation: { $ne: 0 } });
		if (!members[0]) return message.channel.send("На сервере никто не получил репутацию!");

		const embed = new MessageEmbed().setTitle("Топ по репутации").setDescription("");

		members
			.sort((a, b) => b.reputation - a.reputation)
			.slice(0, 10)
			.forEach(async (member, idx) => {
				++idx;
				const user = await message.guild.members.fetch(member.id).catch(() => {});

				embed.description += `\`${idx}\`. **${bot.utils.escapeMarkdown(user?.user.tag || member.id)}** - \`${
					member.reputation
				}\`:star:\n`;

				if (idx === members.slice(0, 10).length) return message.channel.send({ embeds: [embed] });
			});
	},
};
