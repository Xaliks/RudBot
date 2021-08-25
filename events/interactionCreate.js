const { MessageButton } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(bot, interaction) {
        if (!interaction.isButton() || interaction.message.author.id != bot.user.id || interaction.guildId != "681142809654591501") return;
        const { message, user, member } = interaction;

        if (interaction.customId === "тикет") {
            if (member.roles.cache.has("851520479578816533")) return interaction.reply({ content: "Вы не можете открывать тикеты!", ephemeral: true });
            if (message.guild.channels.cache.find((channel) => channel.name === `тикет-${user.username.toLowerCase()}-${user.discriminator}`)) return interaction.reply({ content: "Вы уже открыли тикет!", ephemeral: true });

            const channel = await message.guild.channels.create(`тикет-${user.username}-${user.discriminator}`, { parent: "879788172102467604", reason: "тикеты" });
            await channel.permissionOverwrites.edit(user.id, {
                VIEW_CHANNEL: true
            }, "тикеты")

            interaction.reply({ content: `Вы открыли тикет! <#${channel.id}>`, ephemeral: true });
            channel.send({ content: `Тикет <@${user.id}>.\n\n<@292603927315087360>, <@637309157997019136> и <@678250906407403531> скоро подойдут.`, components: [{ type: 1, components: [new MessageButton().setLabel("ЗАКРЫТЬ ТИКЕТ").setStyle("DANGER").setCustomId("тикет-закрыть")]}] })
        }
        if (interaction.customId === "тикет-закрыть") {
            if (!message.channel.name.startsWith("тикет-")) return;

            message.channel.delete();
        }
    }
}