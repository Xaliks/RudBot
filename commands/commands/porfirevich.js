const fetch = require("node-fetch");
const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
	name: "porfirevich",
	description: "Написать свою историю с помощью https://porfirevich.ru",
	aliases: ["ai", "porf", "gen"],
	cooldown: 100,
	usage: ["<Начало истории>"],
	category: "commands",
	async execute(message, args, bot) {
		let text = bot.utils.escapeMarkdown(args.join(" "));
		let generate = bot.utils.escapeMarkdown(await gen(args.join(" ")));

		const msg = await send(message, `${text}**${generate}**`);
		bot.temp.set(`porfirevich-${message.author.id}-${msg.id}`, [text, generate, gen]);
	},
};

async function gen(text) {
	text = String(text);

	if (text.length > 3000) text = text.substr(text.length - 3000);
	const body = {
		prompt: text,
		length: 30,
	};

	return await fetch("https://pelevin.gpt.dobro.ai/generate/", {
		method: "POST",
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0",
		},
		body: JSON.stringify(body),
	})
		.then((resp) => resp.json())
		.then((resp) => resp.replies[0]);
}
function send(message, text) {
	if (text.length > 3500) text = text.substr(text.length - 3500);

	return message.channel.send({
		embeds: [
			new MessageEmbed()
				.setAuthor({ name: "Порфирьевич", iconURL: "https://cdn.kaneki.cloud/xeellit/skynet.png", url: "https://porfirevich.ru" })
				.setDescription(text)
				.setFooter("Максимальное количество дополняемых слов: 30"),
		],
		components: [
			{
				type: 1,
				components: [
					new MessageButton()
						.setEmoji("<a:loading:685215553312653312>")
						.setStyle(2)
						.setCustomId(`porfirevich_reload-${message.author.id}`),
					new MessageButton()
						.setEmoji("<:plus:864634807060398110>")
						.setStyle(2)
						.setCustomId(`porfirevich_add-${message.author.id}`),
					new MessageButton().setEmoji("❌").setStyle(2).setCustomId(`porfirevich_delete-${message.author.id}`),
				],
			},
		],
	});
}
