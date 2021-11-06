const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "reload",
	description: "Перезагрузить команду",
	aliases: ["rel"],
	category: "botowner",
	execute(message, args, bot) {
		try {
			bot.commands.each((command) => {
				delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];

				const newCommand = require(`../${command.category}/${command.name}.js`);
				bot.commands.set(newCommand.name, newCommand);
			});

			return message.channel.send({
				embeds: [
					new MessageEmbed().setTitle("Reload").setDescription(`**Перезагружено \`${bot.commands.size}\` команд.**`),
				],
			});
		} catch (err) {
			bot.utils.error(`\`\`\`${err.stack}\`\`\``, this, message, bot);
		}
	},
};
