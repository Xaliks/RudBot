const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "bash",
	description: "Команды в консоль",
	category: "botowner",
	usage: ["<команда в консоль>"],
	aliases: ["exe", "console"],
	async execute(message, args, bot) {
		try {
			const out = String(require("child_process").execSync(args.join(" ")));

			message.channel.send({
				embeds: [new MessageEmbed().setDescription(out.slice(0, 3500) || "¯\\_(ツ)_/¯")],
			});
		} catch (e) {
			bot.utils.error(`\`\`\`${e}\`\`\``, this, message, bot);
		}
	},
};
