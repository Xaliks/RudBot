const Discord = require("discord.js");
const config = require("../../config.json");
const fetch = require("node-fetch");

module.exports = {
	name: "eval",
	description: "Eval",
	category: "botowner",
	aliases: ["e"],
	async execute(message, args, bot) {
		try {
			const evaled = await eval(args.join(" ").split("--noreply")[0]);

			if (!message.content.endsWith("--noreply")) message.channel.send({
				embeds: [new Discord.MessageEmbed().setDescription(`\`\`\`js\n${require("util")
				.inspect(evaled, {
					depth: 0,
					maxArrayLength: null,
				})
				.replaceAll(config.token, "BOT_TOKEN")
				.replaceAll(config.mongooseKey, "MONGOOSE_KEY")
				.replaceAll(config.AlexFlipNoteKey, "ALEX_KEY")
				.replaceAll(config.VkToken, "VK_TOKEN")}\`\`\``)],
			});
		} catch (err) {
			message.channel.send({
				embeds: [new Discord.MessageEmbed().setDescription(`\`\`\`bash\n${err.stack
				.replaceAll(config.token, "BOT_TOKEN")
				.replaceAll(config.mongooseKey, "MONGOOSE_KEY")
				.replaceAll(config.AlexFlipNoteKey, "ALEX_KEY")
				.replaceAll(config.VkToken, "VK_TOKEN")}\`\`\``)],
			})
		}
	},
};
