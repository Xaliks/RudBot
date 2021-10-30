const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

/**
 * TODO: Сделать калькулятор по кнопкам
 */
module.exports = {
	name: "calc",
	description: "Калькулятор",
	cooldown: 5,
	usage: ["<Пример>"],
	category: "commands",
	async execute(message, args, bot) {
		const data = await fetch("http://api.mathjs.org/v4/", {
			method: "POST",
			body: JSON.stringify(
				new Object({
					expr: args.join(" "),
				}),
			),
		}).then((resp) => resp.json());

		if (!data.result) {
			if (data.error.startsWith("Error: Undefined symbol "))
				return bot.utils.error(`Неизвестный символ \`${data.error.slice(24)}\``, this, message, bot);
			if (data.error.startsWith("Error: Unexpected operator "))
				return bot.utils.error(
					`Неожиданный оператор \`${data.error.slice(27).split(" ")[0]}\` (символ \`${data.error
						.split("char ")
						.pop()
						.replace(")", "")}\`)`,
					this,
					message,
					bot,
				);
			if (data.error.startsWith("Error: Value expected (char "))
				return bot.utils.error(
					`Неизвестное значение (символ \`${data.error.slice(28).replace(")", "")}\`)`,
					this,
					message,
					bot,
				);

			return bot.utils.error(data.error, this, message, bot);
		}

		message.channel.send({
			embeds: [new MessageEmbed().setTitle("Калькулятор").setDescription(`Ответ: **${data.result}**`)],
		});
	},
};
