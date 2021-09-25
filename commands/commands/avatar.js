const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "avatar",
	description: "Ава пользователя",
	aliases: ["ава", "аватар", "ava"],
	category: "commands",
	usage: ["[@Пользователь/ID]"],
	async execute(message, args, bot) {
		const user = await bot.users.fetch(args[0]).catch(() => bot.utils.findMember(message, args.join(" "), true).user);

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor(bot.utils.escapeMarkdown(member.tag))
					.setDescription(
						`[PNG](${user.displayAvatarURL({
							size: 2048,
							dynamic: true,
							format: "png",
						})}) / [JPG](${user.displayAvatarURL({
							size: 2048,
							dynamic: true,
							fomat: "jpg",
						})}) / [GIF](${user.displayAvatarURL({
							size: 2048,
							dynamic: true,
							fomat: "gif",
						})}) `,
					)
					.setImage(
						user.displayAvatarURL({
							size: 2048,
							dynamic: true,
						}),
					),
			],
		});
	},
};
