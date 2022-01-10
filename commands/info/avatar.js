const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "avatar",
	description: "Ава пользователя",
	aliases: ["ava"],
	category: "info",
	usage: ["[@Пользователь/ID]"],
	async execute(message, args, bot) {
		const user = await bot.users.fetch(args[0]).catch(() => bot.utils.findMember(message, args.join(" "), true).user);
		const formats = ["webp", "png", "jpg"];
		if (user.avatar.startsWith("a_")) formats.push("gif");

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: bot.utils.escapeMarkdown(user.tag) })
					.setDescription(
						formats
							.map(
								(format) =>
									`[${format.toUpperCase()}](${user.displayAvatarURL({
										size: 2048,
										format,
									})})`,
							)
							.join(" / "),
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
