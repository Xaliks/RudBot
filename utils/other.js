const fetch = require("node-fetch");
const { xml2json } = require("xml-js");

module.exports = (bot) => {
	function check() {
		const videos = require("../data/TBR.json");
		Object.entries(videos.YT).forEach(async (data) => {
			const json = JSON.parse(
				xml2json(
					await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + data[0]).then((resp) =>
						resp.text(),
					),
				),
			).elements[0].elements;
			const author = json[5].elements[0].elements[0].text;

			json.splice(0, 7);

			const video = json.sort(
				(a, b) => new Date(a.elements[6].elements[0].text) - new Date(b.elements[6].elements[0].text),
			)[0];
			if (video && !data[1].videos.includes(video.elements[0].elements[0].text)) {
				bot.channels.cache
					.get(data[1].channel)
					.send(
						data[1].text
							.replace("{channel_name}", author)
							.replace("{link}", video.elements[4].attributes.href)
							.replace("{discord_server}", data[1].discord_server),
					)
					.then((message) => message.crosspost());
				data[1].videos.push(video.elements[0].elements[0].text);

				videos.YT[data[0]] = data[1];

				require("fs").writeFileSync("./data/TBR.json", JSON.stringify(videos, null, 2));
			}
		});
	}
	check();
	setInterval(check, 30 * 1000);
};
