const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "covid",
	description: "Информация о коронавирусе",
	usage: ["[Страна]"],
	cooldown: 10,
	category: "info",
	aliases: ["ковид"],
	async execute(message, args, bot) {
		const country = args.join(" ");
		let data = await fetch(
			"https://disease.sh/v3/covid-19/countries/" + encodeURIComponent(country),
		).then((res) => res.json());
		if (!country)
			data = await fetch("https://disease.sh/v3/covid-19/all").then((res) => res.json());
		if (data.message) return bot.utils.error("Страна не найдена!", message);

		message.channel.send({
			content: `Обновление было сегодня в **${bot.utils.formatDate(data.updated, "%fullTime")}**`,
			embeds: [
				new MessageEmbed()
					.setTitle(data.country || "Коронавирус")
					.setDescription(
						`Заражений: \`${bot.utils.formatNumber(data.cases)}\`
Заражений за сегодня: \`${bot.utils.formatNumber(data.todayCases)}\`

Смертей: \`${bot.utils.formatNumber(data.deaths)}\`
Смертей за сегодня: \`${bot.utils.formatNumber(data.todayDeaths)}\`

Выздоровело: \`${bot.utils.formatNumber(data.recovered)}\`
Выздоровело за сегодня: \`${bot.utils.formatNumber(data.todayRecovered)}\`

Болеет: \`${bot.utils.formatNumber(data.active)}\`
В критическом состоянии: \`${bot.utils.formatNumber(data.critical)}\`
Сделано тестов: \`${bot.utils.formatNumber(data.tests)}\``,
					)
					.setThumbnail(
						`${
							data.countryInfo?.flag ||
							"https://storage.myseldon.com/news_pict_CD/CDC0F8531BA1D162DE098B176BB260C1"
						}`,
					),
			],
		});
	},
};
