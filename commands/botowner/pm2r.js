module.exports = {
	name: "pm2r",
	description: "Команды в консоль",
	category: "botowner",
	async execute(message, args, bot) {
		await message.channel.send("Перезагружаюсь...");

		require("child_process").execSync("npm run reload").toString("utf8");
	},
};
