const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require(`discord.js`)
const axios = require(`axios`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`ytmp4`)
    .setDescription(`Download A Youtube Video`)
    .addStringOption(
        o => o
            .setName(`video-id`)
            .setDescription(`The youtube video id to download`)
            .setRequired(true)
    ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const vidID = interaction.options.getString(`video-id`)

        const input = {
            method: `GET`,
            url: 'https://youtube-video-download-info.p.rapidapi.com/dl',
            params: { id: vidID},
            headers: {
                'X-RapidAPI-Key': '8eb6246ce4msh6ab6a6dc2a3f0fcp1ad7c7jsna73234d6f1e3',
                'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
        }
        try{
            const output = await axios.request(input)
            const link = output.data.link[22]

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel(`Download MP4`)
                    .setEmoji(`📬`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(link[0])
                )
            const embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setDescription(`📽️ Download the mp4 version of \`${output.data.title}\` below!`)

            await interaction.editReply({ embeds: [embed], components: [button]})
        } catch (error) {
            console.log(error);
            await interaction.editReply({ content: '⚠️ That Video ID is not a valid! go to the URL and copy the ID at the end of the link'})
        }
    } 

}