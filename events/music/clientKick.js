const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "clientKick",
	async execute(bot, guildId) {
		const player = bot.music.players.get(guildId);
        if (!player) return;

        player.message.channel.send({
            embeds: [new MessageEmbed().setTitle("🎶 Очередь очищена").setDescription("Меня кикнули из канала :(")]  
        })
        player.message.delete().catch(() => null);

        player.destroy();
	},
};
