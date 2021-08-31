const { VkToken } = require("../../config.json");
const vk = require("../../data/vk.json");
const { emoji } = require("../../data/emojis.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "vkontakte",
	description: "Инфо о пользователе/группе в vk.com",
	usage: ["<get/search>", "<user/group>", "<ID>"],
	aliases: ["vk"],
	category: "info",
	async execute(message, args, bot) {
		const [form, type, ...query] = args;
		const embeds = [];

		switch (type.toLowerCase()) {
			case "user":
				let userInfo;
				if (form === "get") {
					userInfo = await fetch("users.get", {
						fields: [
							"verified",
							"sex",
							"bdate",
							"city",
							"country",
							"photo_max_orig",
							"online",
							"domain",
							"contacts",
							"status",
							"last_seen",
							"followers_count",
							"common_count",
							"occupation",
							"nickname",
							"relatives",
							"relation",
							"personal",
							"connections",
							"exports",
							"activities",
							"interests",
							"music",
							"movies",
							"tv",
							"books",
							"games",
							"about",
							"quotes",
							"is_favorite",
							"is_hidden_from_feed",
							"timezone",
							"screen_name",
							"maiden_name",
							"crop_photo",
							"career",
							"military",
							"blacklisted",
							"can_be_invited_group",
						],
						offset: 0,
						user_ids: query[0],
					});
					if (!userInfo.response)
						return bot.utils.error(`Пользователь с ID \`${query[0]}\` не найден!`, this, message, bot);
				} else if (form === "search") {
					userInfo = await fetch("users.search", {
						fields: [
							"verified",
							"sex",
							"bdate",
							"city",
							"country",
							"photo_max_orig",
							"online",
							"domain",
							"contacts",
							"status",
							"last_seen",
							"followers_count",
							"common_count",
							"occupation",
							"nickname",
							"relatives",
							"relation",
							"personal",
							"connections",
							"exports",
							"activities",
							"interests",
							"music",
							"movies",
							"tv",
							"books",
							"games",
							"about",
							"quotes",
							"is_favorite",
							"is_hidden_from_feed",
							"timezone",
							"screen_name",
							"maiden_name",
							"crop_photo",
							"career",
							"military",
							"blacklisted",
							"can_be_invited_group",
						],
						offset: 0,
						sort: 0,
						count: 20,
						p: query.join(" "),
					});
					if (userInfo.response.count === 0)
						return bot.utils.error(`Пользователь по запросу \`${query.join(" ")}\` не найден!`, this, message, bot);
				} else return bot.utils.error(`Неизвестный тип! Доступные типы: \`${this.usage[0]}\``, this, message, bot);

				(form === "get" ? userInfo.response : userInfo.response.items).forEach((info) => {
					console.log(info);
					if (info.deactivated)
						embeds.push(
							new MessageEmbed()
								.setTitle(info.first_name)
								.setURL(`https://vk.com/${info.domain}`)
								.setThumbnail(info.photo_max_orig).setDescription(`
**ПОЛЬЗОВАТЕЛЬ ${info.deactivated === "banned" ? "ЗАБАНЕН" : "УДАЛЁН"}**


Пол: **${vk.sex[info.sex]}**
`),
						);
					else
						embeds.push(
							new MessageEmbed()
								.setTitle(`${info.first_name} ${info.last_name}`)
								.setURL(`https://vk.com/${info.domain}`)
								.setThumbnail(info.photo_max_orig)
								.setDescription(
									`
Подписчиков: \`${info.followers_count || "Неизвестно"}\`
Статус: ${info.online === 1 ? emoji.online : emoji.offline}**${bot.utils.escapeMarkdown(info.status) || "Отсутствует"}**
Последний заход: **${info.last_seen ? bot.utils.formatDate(info.last_seen.time * 1000, "%full") : "Неизвестно"}**

Пол: **${vk.sex[info.sex]}**
Год рождения: **${info.bdate || "Неизвестно"}**
Город: ${info.city ? `**${info.city.title}** (${info.country.title})` : "**Неизвестно**"}

Мобильный телефон: \`${info.mobile_phone || "Не указан"}\`
Домашний телефон: \`${info.home_phone || "Не указан"}\`
`,
								)
								.addField(
									"Жизненная позиция",
									info.personal
										? `
Языки: **${info.personal.langs.join("**, **")}**
Политические предпочтения: **${vk.political[info.personal.political] || "Не указано"}**
Мировоззрение: **${info.personal.religion || "Не указано"}**
Источники вдохновения: **${info.personal.inspired_by || "Не указано"}**
Главное в людях: **${vk.people_main[info.personal.people_main] || "Не указано"}**
Главное в жизни: **${vk.life_main[info.personal.life_main] || "Не указано"}**
Отношение к курению: **${vk.smoking[info.personal.smoking] || "Не указано"}**
Отношение к алкоголю: **${vk.smoking[info.personal.alcohol] || "Не указано"}**
`
										: "Ничего неизвестно",
								),
						);
				});

				bot.utils.pages(message, embeds);
				break;

			case "group":
				if (form != "get" && form != "search")
					return bot.utils.error(`Неизвестный тип! Доступные типы: \`${this.usage[0]}\``, this, message, bot);
				const groupInfo = await fetch("groups.getById", {
					fields: [
						"city",
						"country",
						"place",
						"description",
						"wiki_page",
						"market",
						"members_count",
						"counters",
						"start_date",
						"finish_date",
						"can_post",
						"can_see_all_posts",
						"activity",
						"status",
						"contacts",
						"links",
						"fixed_post",
						"verified",
						"site",
						"ban_info",
						"cover",
					],
					offset: 0,
					group_ids: query[0],
				});
				if (!groupInfo.response) return bot.utils.error(`Группа с ID \`${query[0]}\` не найдена!`, this, message, bot);
				groupInfo.response.forEach((info) => {
					embeds.push(
						new MessageEmbed()
							.setTitle(info.name)
							.setURL(`https://vk.com/${info.screen_name}`)
							.setThumbnail(info.photo_200)
							.setImage(info.cover.enabled === 1 ? info.cover.images.pop().url : null)
							.setDescription(
								`
Участников: \`${bot.utils.formatNumber(info.members_count)}\`
Тема группы: **${info.activity}**
Статус: **${info.status || "Отсутствует"}**
${
	info.links && info.links[0]
		? "Ссылки:\n" + info.links.map((link) => `[\`${link.name}\`](${link.url}) | ${link.desc}`).join("\n") + "\n"
		: ""
}
Описание: \`${info.description || "Отсутствует"}\`
`,
							)
							.addField(
								"Контакты",
								info.contacts
									? info.contacts.map((cnt) => `ID: \`${cnt.user_id || cnt.email}\` ${cnt.desc || ""}`).join("\n")
									: "Отсутствуют",
							),
					);
				});
				bot.utils.pages(message, embeds);
				break;

			default:
				bot.utils.error(`Неизвестный тип! Доступные типы: \`${this.usage[1]}\``, this, message, bot);
				break;
		}
	},
};

async function fetch(method, params) {
	return await require("node-fetch")(
		`https://api.vk.com/method/${method}?${_toURI(params)}&access_token=${VkToken}&v=5.131`,
	).then((resp) => resp.json());
}
function _toURI(obj) {
	return Object.entries(obj).reduce((acc, [key, val]) => {
		if (Array.isArray(val)) {
			let temp = "";
			acc += key + "=";
			val
				.map((e) => {
					acc += (temp ? "," : "") + encodeURIComponent(e);
					temp += "a";
				})
				.join("");
		} else {
			acc += (acc ? "&" : "") + key + "=" + encodeURIComponent(val);
		}
		return acc;
	}, "");
}
