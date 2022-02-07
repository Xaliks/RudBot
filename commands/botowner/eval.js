const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
	name: "eval",
	description: "Eval",
	category: "botowner",
	aliases: ["e", "ebal"],
	async execute(message, args, bot) {
		try {
			const evaled = await eval(args.join(" ").split("--noreply")[0]).catch((e) => JSON.stringify(e));

			if (message.content.endsWith("--noreply")) return;

			message.channel.send({
				content: `\`\`\`js\n${require("util")
					.inspect(evaled, {
						depth: 0,
						maxArrayLength: null,
					})
					.replaceAll(config.token, "BOT_TOKEN")
					.replaceAll(config.mongooseKey, "MONGOOSE_KEY")
					.replaceAll(config.AlexFlipNoteKey, "ALEX_KEY")
					.replaceAll(config.VkToken, "VK_TOKEN")}\`\`\``,
			});
		} catch (err) {
			message.channel.send({
				embeds: [new MessageEmbed().setTitle(`Eval`).setDescription(`\`\`\`${err.stack}\`\`\``)],
			});
		}
	},
};
