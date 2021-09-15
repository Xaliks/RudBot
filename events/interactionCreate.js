const { MessageButton } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	async execute(bot, interaction) {
		if (
			!interaction.isButton() ||
			interaction.message.author.id != bot.user.id ||
			interaction.guildId != "681142809654591501"
		)
			return;
		const { message, user, member } = interaction;

		if (interaction.customId === "тикет") {
			if (member.roles.cache.has("851520479578816533"))
				return interaction.reply({ content: "Вы не можете открывать тикеты!", ephemeral: true });
			if (
				message.guild.channels.cache.find(
					(channel) => channel.name === `тикет-${user.username.toLowerCase()}-${user.discriminator}`,
				)
			)
				return interaction.reply({ content: "Вы уже открыли тикет!", ephemeral: true });

			const channel = await message.guild.channels.create(`тикет-${user.username}-${user.discriminator}`, {
				parent: "879788172102467604",
				reason: "тикеты",
				permissionOverwrites: [
					{
						id: message.guild.id,
						allow: [
							"SEND_MESSAGES",
							"EMBED_LINKS",
							"ATTACH_FILES",
							"ADD_REACTIONS",
							"USE_EXTERNAL_EMOJIS",
							"USE_EXTERNAL_STICKERS",
							"READ_MESSAGE_HISTORY",
							"SEND_TTS_MESSAGES",
						],
						deny: [
							"VIEW_CHANNEL",
							"MANAGE_CHANNELS",
							"MANAGE_WEBHOOKS",
							"MANAGE_MESSAGES",
							"CREATE_INSTANT_INVITE",
							"MENTION_EVERYONE",
							"USE_PUBLIC_THREADS",
							"USE_PRIVATE_THREADS",
							"MANAGE_THREADS",
							"USE_APPLICATION_COMMANDS",
						],
					},
					{
						id: "748468559897952276",
						allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "MANAGE_MESSAGES"],
					},
					{
						id: "678250906407403531",
						allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "MANAGE_MESSAGES"],
					},
					{
						id: user.id,
						allow: ["VIEW_CHANNEL"],
					},
				],
			});

			channel.send({
				content: `Тикет <@${user.id}>.\n\n<@748468559897952276>, <@637309157997019136> и <@678250906407403531> скоро подойдут.`,
				components: [
					{
						type: 1,
						components: [new MessageButton().setLabel("ЗАКРЫТЬ ТИКЕТ").setStyle("DANGER").setCustomId("тикет-закрыть")],
					},
				],
			});
			interaction.reply({ content: `Вы открыли тикет! <#${channel.id}>`, ephemeral: true });
		}
		if (interaction.customId === "тикет-закрыть") {
			if (!message.channel.name.startsWith("тикет-")) return;

			message.channel.delete();
		}
	},
};
