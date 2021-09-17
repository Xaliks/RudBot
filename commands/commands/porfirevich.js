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
		const collector = msg.createMessageComponentCollector();

		collector.on("collect", async (btn) => {
			if (msg.deleted) return collector.stop();
			if (btn.user.id != message.author.id)
				return btn.reply({ content: "Ты не можешь использовать это!", ephemeral: true });

			if (btn.customId === "reload") {
				generate = bot.utils.escapeMarkdown(await gen(text + generate));

				let reply = `${text}**${generate}**`;
				if (reply.length > 3900) reply = "..." + reply.substr(reply.length - 3800);

				btn.reply({ content: "Новый вариант появился!", ephemeral: true });
				msg.embeds[0].description = reply;
				msg.edit({ embeds: msg.embeds });
			}
			if (btn.customId === "add") {
				text += generate;
				generate = bot.utils.escapeMarkdown(await gen(text));

				let reply = `${text}**${generate}**`;
				if (reply.length > 3900) reply = "..." + reply.substr(reply.length - 3800);

				btn.reply({ content: "Продолжение появилось!", ephemeral: true });
				msg.embeds[0].description = reply;
				msg.edit({ embeds: msg.embeds });
			}
		});
	},
};

async function gen(text) {
	if (text.length > 3000) text = text.substr(text.length - 3000);
	const body = {
		prompt: String(text),
		length: 30,
	};

	return await fetch("https://pelevin.gpt.dobro.ai/generate/", {
		method: "POST",
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.97 Safari/537.36 Vivaldi/1.94.1008.34",
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
				.setAuthor("Порфирьевич", "https://cdn.kaneki.cloud/xeellit/skynet.png", "https://porfirevich.ru")
				.setDescription(text)
				.setFooter("Максимальное количество дополняемых слов: 30"),
		],
		components: [
			{
				type: 1,
				components: [
					new MessageButton().setEmoji("<a:loading:685215553312653312>").setStyle(2).setCustomId("reload"),
					new MessageButton().setEmoji("<:plus:864634807060398110>").setStyle(2).setCustomId("add"),
				],
			},
		],
	});
}
