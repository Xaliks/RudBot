const { MessageEmbed } = require("discord.js");
const formats = ["webp", "png", "jpg"];

module.exports = {
	name: "avatar",
	description: "Ава пользователя",
	aliases: ["ava"],
	category: "info",
	usage: ["[@Пользователь/ID]"],
	async execute(message, args, bot) {
		const user = await bot.users
			.fetch(args.join(""))
			.catch(() => bot.utils.findMember(message, args.join(" "), true).then((member) => member.user));
		if (user.avatar.startsWith("a_")) formats.push("gif");

		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setAuthor({ name: user.tag })
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
