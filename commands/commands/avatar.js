const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "avatar",
	description: "Ава пользователя",
	aliases: ["ава", "аватар", "ava"],
	category: "commands",
	usage: ["[@Пользователь/ID]"],
	async execute(message, args, bot) {
		let member;
		member = await bot.users
			.fetch(args[0])
			.catch((e) => (member = bot.utils.findMember(message, args.join(" "), true)?.user));

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor(bot.utils.escapeMarkdown(member.tag))
					.setDescription(
						`[PNG](${member.displayAvatarURL({
							size: 2048,
							dynamic: true,
							format: "png",
						})}) / [JPG](${member.displayAvatarURL({
							size: 2048,
							dynamic: true,
							fomat: "jpg",
						})}) / [GIF](${member.displayAvatarURL({
							size: 2048,
							dynamic: true,
							fomat: "gif",
						})}) `,
					)
					.setImage(
						member.displayAvatarURL({
							size: 2048,
							dynamic: true,
						}),
					),
			],
		});
	},
};
