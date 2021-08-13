module.exports = {
	name: "pm2r",
	description: "Команды в консоль",
	category: "botowner",
	async execute(message, args, bot) {
		await message.channel.send("Перезагружаюсь...");

		require("child_process")
			.execSync("pm2 reload RudBot --force && pm2 reset RudBot")
			.toString("utf8");
	},
};
