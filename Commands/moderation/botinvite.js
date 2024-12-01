const { SlashCommandBuilder, PermissionsFlagsBits, OAuth2Scopes, EmbedBuilder } = require('discord.js')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('bot-invite')
    .setDescription('Create a custom invite for this bot')
    .addStringOption(o => o.setName('permissions').setDescription('The permissions you want the bot to have.').addChoices(
        { name: `View Server (No Mod Perms)`, value: `517547088960` },
        { name: `Basic Moderation (Manage Messages, Roles and Emojis)`, value: `545195949136` },
        { name: `Advanced Moderation (Manage Server)`, value: `545195949174` },
        { name: `Administrator (Every Permission)`, value: `8` },
    ).setRequired(true)),
    async execute (interaction, client) {
        const perms = interaction.options.getString('permissions')
 
        const link = client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
            permissions: [
                perms
            ],
        });
 
        const embed = new EmbedBuilder()
        .setColor(process.env.EMBEDCOLOR)
 
        if (!perms === 8) embed.setDescription(`I have generated an invite using the permissions you provided! To view the specific permissions, click on the invite and continue with a selected server. \n \n This bot may require **admin perms** to fully function! By not selecting the highest perms for your server, you risk not being able to use all of this bots features. \n\n> ${link}`)
        else embed.setDescription(`I have generated an invite using the permissions you provided! To view the specific permissions, click on the invite and continue with a selected server! \n> ${link}`)
 
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}