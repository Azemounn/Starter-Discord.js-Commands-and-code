const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Models/warningSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('This gets a members warnings')
    .addUserOption(option => option.setName("user").setDescription("The member you want to check the warns of").setRequired(true)),
    async execute(interaction) {
 
        const { options, guildId, user } = interaction;
 
        const target = options.getUser("user");
 
        const embed = new EmbedBuilder()
        const noWarns = new EmbedBuilder()
 
        warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: target.tag }, async (err, data) => {
 
            if (err) throw err;
            console.log(data)
 
            if (data) {
                embed.setColor("Blue")
                .setDescription(`:white_check_mark: ${target.tag}'s warnings: \n${data.Content.map(
                    (w, i) => 
                        `
                            **Warning**: ${i + 1}
                            **Warning Moderator**: ${w.ExecuterTag}
                            **Warn Reason**: ${w.Reason}
                        `
                ).join(`-`)}`)
 
                interaction.reply({ embeds: [embed] });
            } else {
                noWarns.setColor("Blue")
                .setDescription(`:white_check_mark: ${target.tag} has **0** warnings!`)
 
                interaction.reply({ embeds: [noWarns] });
            }
        });
 
    }
}