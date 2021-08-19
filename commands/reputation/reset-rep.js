const members = require("../../models/member");

module.exports = {
	name: "reset-rep",
	description: "Обнулить рeпутацию на сервере",
	category: "reputation",
	cooldown: 60,
	aliases: ["resetrep"],
	async execute(message, args, bot) {
		const filter = (m) => message.author.id === m.author.id;

		if (!message.member.permissions.has(["ADMINISTRATOR"]))
			return bot.utils.error("У вас нет прав! (Администратор)", message);

		message.reply("Вы уверены что хотите это сделать? **Да/Нет** (У вас есть 15 секунд)");

		message.channel
			.awaitMessages(filter, {
				time: 15000,
				max: 1,
				errors: ["time"],
			})
			.then(async (msgs) => {
				const msg = msgs.first();
				if (["y", "yes", "д", "да"].includes(msg.content.toLowerCase())) {
					const data = (
						await members.find({
							guild_id: message.guild.id,
						})
					)
						.map((v) => {
							return {
								rep: v.reputation,
								...v,
							};
						})
						.sort((a, b) => b.rep - a.rep)
						.filter((u) => u.rep !== 0);

					data.forEach(async (item, idx) => {
						bot.database.user.update({ id: item._doc.user_id, guild_id: message.guild.id }, { reputation: 0 });
					});
					bot.utils.success("Репутация была полностью сброшена!", msg);
				} else message.channel.send("Действие отклонено!");
			})
			.catch(() => {
				bot.utils.error("Время вышло!", message);
			});
	},
};
