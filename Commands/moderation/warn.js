const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Models/warningSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('This warns a server member')
    .addUserOption(option => option.setName("user").setDescription("The user you want to warn").setRequired(true))
    .addStringOption(option => option.setName("reason").setDescription("This is the reason for warning the user").setRequired(false)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: `You don't have permission to warn people!`, ephemeral: true });
 
        const { options, guildId, user } = interaction;
 
        const target = options.getUser("user");
        const reason = options.getString("reason") || "No reason given";
 
        const userTag = `${target.username}#${target.discriminator}`
 
        warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: userTag }, async (err, data) => {
 
            if (err) throw err;
 
            if (!data) {
                data = new warningSchema({
                    GuildID: guildId,
                    UserID: target.id,
                    Content: [
                        {
                            ExecuterId: user.id,
                            Reason: reason
                        }
                    ],
                });
 
            } else {
                const warnContent = {
                    ExecuterId: user.id,
                    Reason: reason
                }
                data.Content.push(warnContent);
            }
            data.save()
        });
 
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: You have been warned in ${interaction.guild.name} | ${reason}`)
 
        const embed2 = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: ${target.tag} has been **warned** | ${reason}`)
 
        target.send({ embeds: [embed] }).catch(err => {
            return;
        })
 
        interaction.reply({ embeds: [embed2] });
    }
}