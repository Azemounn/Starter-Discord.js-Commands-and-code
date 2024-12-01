const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Models/warningSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('This clears a members warnings')
    .addUserOption(option => option.setName("user").setDescription("The user you want to clear the warnings of").setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: `You don't have permission to clear people's warnings!`, ephemeral: true });
 
        const { options, guildId, user } = interaction;
 
        const target = options.getUser("user");
        
        const embed = new EmbedBuilder()
 
        warningSchema.findOne({ GuildID: guildId, UserID: target.id}, async (err, data) => {
 
            if (err) throw err;
 
            if (data) {
                await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id})
 
                embed.setColor("Blue")
                .setDescription(`:white_check_mark: ${target.tag}'s warnings have been cleared`)
 
                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply({ content: `${target.tag} has no warnings to be cleared`, ephemeral: true });
            }
        });
    }
}