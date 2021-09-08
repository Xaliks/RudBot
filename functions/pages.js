const { MessageButton } = require("discord.js");

module.exports = async (message, pages, timeout = 180000) => {
	if (pages.length === 1) return message.channel.send({ embeds: pages });

	let page = 0;
	const buttons = [
		new MessageButton().setEmoji("⏪").setCustomId("2left").setStyle("SECONDARY"),
		new MessageButton().setEmoji("◀️").setCustomId("left").setStyle("SECONDARY"),
		new MessageButton()
			.setEmoji("🛑")
			.setLabel(`${page + 1} / ${pages.length}`)
			.setCustomId("stop")
			.setStyle("DANGER"),
		new MessageButton().setEmoji("▶️").setCustomId("right").setStyle("SECONDARY"),
		new MessageButton().setEmoji("⏩").setCustomId("2right").setStyle("SECONDARY"),
	];
	const msg = await message.channel.send({
		embeds: [pages[page]],
		components: [{ type: 1, components: buttons }],
	});

	const filter = (m) => m.user.id === message.author.id;
	const colletor = msg.createMessageComponentCollector({
		filter,
		time: timeout,
	});
	colletor.on("collect", (btn) => {
		switch (btn.customId) {
			case "2left":
				page = page != 0 ? 0 : pages.length - 1;
				break;
			case "left":
				page > 0 ? --page : (page = pages.length - 1);
				break;
			case "stop":
				msg.delete();
				break;
			case "right":
				page + 1 < pages.length ? ++page : (page = 0);
				break;
			case "2right":
				page = page + 1 < pages.length ? pages.length - 1 : 0;
				break;

			default:
				break;
		}

		buttons[2].setLabel(`${page + 1} / ${pages.length}`);
		btn
			.update({
				embeds: [pages[page]],
				components: [{ type: 1, components: buttons }],
			})
			.catch(() => null);
	});
	colletor.on("end", () => {
		msg.edit({ embeds: msg.embeds, components: [] }).catch(() => null);
	});
};
