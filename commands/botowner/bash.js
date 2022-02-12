module.exports = {
	name: "bash",
	description: "Команды в консоль",
	category: "botowner",
	aliases: ["exe", "console"],
	async execute(message, args, bot) {
		try {
			const out = String(require("child_process").execSync(args.join(" ")));

			message.channel.send({
				content: `\`\`\`bash\n${out}\`\`\``,
			});
		} catch (e) {
			message.channel.send({
				content: `\`\`\`bash\n${e}\`\`\``,
			});
		}
	},
};
