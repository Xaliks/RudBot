const { VkToken } = require("../../config.json");
const { vk, emojis } = require("../../data/data.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "vkontakte",
	description: "Инфо о пользователе/группе в vk.com",
	usage: ["<user/group>", "<ID>"],
	aliases: ["vk"],
	category: "info",
	async execute(message, args, bot) {
		const [type, ...query] = args;
		const embeds = [];

		if (type.toLowerCase() === "user") {
			const fields = [
				"sex",
				"bdate",
				"city",
				"country",
				"photo_max_orig",
				"online",
				"domain",
				"status",
				"last_seen",
				"followers_count",
				"personal",
			].join(",");

			const get =
				(await fetch("users.get", {
					sort: 0,
					user_id: query[0],
					fields,
				}).then((resp) => resp.response)) || [];
			const users = get.concat(
				(
					(await fetch("users.search", {
						sort: 0,
						q: query.join(" "),
						fields,
					}).then((resp) => {
						if (resp.error) {
							bot.utils.error(
								"Достигнут глобальный лимит запросов в вконтакте! Обратитесь к создателю бота",
								this,
								message,
								bot,
							);
							return;
						}
						return resp.response.items;
					})) || get
				).filter((user) => user.domain != get[0]?.domain),
			);
			if (!users[0])
				return bot.utils.error(`Пользователь по запросу \`${query.join(" ")}\` не найден!`, this, message, bot);

			users.forEach((user) => {
				if (user.deactivated)
					embeds.push(
						new MessageEmbed()
							.setTitle(`${user.first_name} ${user.last_name}`)
							.setURL(`https://vk.com/${user.domain}`)
							.setThumbnail(user.photo_max_orig)
							.setDescription(
								`**ПОЛЬЗОВАТЕЛЬ ${user.deactivated === "banned" ? "ЗАБАНЕН" : "УДАЛЁН"}**\n\n\nПол: **${
									vk.sex[user.sex]
								}**`,
							)
							.setFooter(`ID: ${user.domain}`),
					);
				else if (user.is_closed)
					embeds.push(
						new MessageEmbed()
							.setTitle(`${user.first_name} ${user.last_name}`)
							.setURL(`https://vk.com/${user.domain}`)
							.setThumbnail(user.photo_max_orig)
							.setDescription(
								`**ПОЛЬЗОВАТЕЛЬ ЗАКРЫЛ СВОЙ ПРОФИЛЬ**\n\n\nСтатус: ${
									user.online === 1 ? emojis.online : emojis.offline
								}**${bot.utils.escapeMarkdown(user.status) || "Отсутствует"}**\n\nПол: **${
									vk.sex[user.sex]
								}**\nГод рождения: **${user.bdate || "Неизвестно"}**\nГород: ${
									user.city ? `**${user.city.title}** (${user.country.title})` : "**Неизвестно**"
								}`,
							)
							.setFooter(`ID: ${user.domain}`),
					);
				else
					embeds.push(
						new MessageEmbed()
							.setTitle(`${user.first_name} ${user.last_name}`)
							.setURL(`https://vk.com/${user.domain}`)
							.setThumbnail(user.photo_max_orig)
							.setDescription(
								`Подписчиков: \`${user.followers_count || "Неизвестно"}\`
Статус: ${user.online === 1 ? emojis.online : emojis.offline}**${bot.utils.escapeMarkdown(user.status) || "Отсутствует"}**
Последний заход: **${user.last_seen ? bot.utils.formatDate(user.last_seen.time * 1000, "%full") : "Неизвестно"}**

Пол: **${vk.sex[user.sex]}**
Год рождения: **${user.bdate || "Неизвестно"}**
Город: ${user.city ? `**${user.city.title}** (${user.country.title})` : "**Неизвестно**"}

Мобильный телефон: \`${user.mobile_phone || "Не указан"}\`
Домашний телефон: \`${user.home_phone || "Не указан"}\``,
							)
							.addField(
								"Жизненная позиция",
								user.personal
									? `Языки: **${user.personal.langs?.join("**, **") || "Не указано"}**
Политические предпочтения: **${vk.political[user.personal.political] || "Не указано"}**
Мировоззрение: **${user.personal.religion || "Не указано"}**
Источники вдохновения: **${user.personal.inspired_by || "Не указано"}**
Главное в людях: **${vk.people_main[user.personal.people_main] || "Не указано"}**
Главное в жизни: **${vk.life_main[user.personal.life_main] || "Не указано"}**
Отношение к курению: **${vk.smoking[user.personal.smoking] || "Не указано"}**
Отношение к алкоголю: **${vk.smoking[user.personal.alcohol] || "Не указано"}**`
									: "Ничего неизвестно",
							)
							.setFooter(`ID: ${user.domain}`),
					);
			});

			bot.utils.pages(message, embeds);
		}

		if (type.toLowerCase() === "group") {
			const fields = [
				"activity",
				"age_limits",
				"city",
				"contacts",
				"country",
				"cover",
				"description",
				"links",
				"members_count",
				"site",
				"status",
				"photo_max_orig",
			].join(",");

			const get =
				(await fetch("groups.getById", {
					sort: 0,
					group_ids: query[0],
					fields,
				}).then((resp) => resp.response)) || [];
			const groups = get.concat(
				(
					(await fetch("groups.search", {
						sort: 6,
						q: query.join(" "),
						type: "group",
						fields,
					}).then((resp) => {
						if (resp.error) {
							bot.utils.error(
								"Достигнут глобальный лимит запросов в вконтакте! Обратитесь к создателю бота",
								this,
								message,
								bot,
							);
							return;
						}
						return resp.response.items;
					})) || get
				).filter((group) => group.id != get[0]?.id),
			);
			if (!groups[0]) return bot.utils.error(`Группа по запросу \`${query.join(" ")}\` не найден!`, this, message, bot);

			groups.forEach((group) => {
				if (group.deactivated || group.is_closed != 0)
					return embeds.push(
						new MessageEmbed()
							.setTitle(group.name)
							.setURL(`https://vk.com/${group.screen_name}`)
							.setThumbnail(group.photo_max_orig)
							.setDescription(
								`**ГРУППА ${group.deactivated ? (group.deactivated === "banned" ? "ЗАБАНЕНА" : "УДАЛЁНА") : "ЗАКРЫТА"}**`,
							)
							.setFooter(`ID: ${group.screen_name}`),
					);
				embeds.push(
					new MessageEmbed()
						.setTitle(group.name)
						.setURL(`https://vk.com/${group.screen_name}`)
						.setThumbnail(group.photo_max_orig)
						.setDescription(
							`Участников: \`${bot.utils.formatNumber(group.members_count)}\`
Тематика группы: **${group.activity}**
Возрастное ограничение: **${vk.age_limits[group.age_limits]}**
Статус: **${group.status || "Отсутствует"}**
Город: ${group.city ? `**${group.city.title}** (${group.country.title})` : "**Неизвестно**"}
Сайт: \`${group.site || "Отсутствует"}\`
Ссылки: ${(group.links || []).map((link) => `[\`${link.desc || link.name}\`](${link.url})`).join(", ") || "`Отсутствуют`"}
Контакты: ${
								(group.contacts || [])
									.map((contact) => {
										let content = [];
										if (contact.user_id) content.push(`**https://vk.com/id${contact.user_id}**`);
										if (contact.phone) content.push(`**${contact.phone}**`);
										if (contact.desc) content.push(`**${contact.desc}**`);
										return content.join(" `|` ");
									})
									.join("\n") || "`Отсутствуют`"
							}`,
						)
						.addField(
							"Описание группы:",
							bot.utils.escapeMarkdown(group.description || "Отсутствует").substr(0, 1024),
							false,
						)
						.setFooter(`ID: ${group.screen_name}`)
						.setImage((group.cover?.images || [])[0]?.url || null),
				);
			});

			bot.utils.pages(message, embeds);
		}
	},
};

async function fetch(method, params) {
	return await require("node-fetch")(
		`https://api.vk.com/method/${method}?${require("querystring").encode(params)}&access_token=${VkToken}&v=5.131`,
	).then((resp) => resp.json());
}
