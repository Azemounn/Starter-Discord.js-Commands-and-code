const {SlashCommandBuilder , EmbedBuilder} = require(`discord.js`)
const axios = require(`axios`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName("text-sumarize")
    .setDescription("This Command Sumarizes Text.")
    .addStringOption(o => o.setName('text').setDescription("The Text to Sumarize").setRequired(true)),

    async execute (interaction) {
        await interaction.deferReply({ephemeral: true});

        const { options } = interaction;
        const text = options.getString(`text`);
        const input = {
            method: 'POST',
            url: 'https://gpt-summarization.p.rapidapi.com/summarize',
            headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'insert your own',
            'X-RapidAPI-Host': 'insert your own '
            },
            data: {
            text: text,
            num_sentences: 3
            }
        };
 
        try {
            const output = await axios.request(input);
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(output.data.summary)
 
            await interaction.editReply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
            await interaction.editReply({ content: "There was an error, try this again later!"})
        }
 
  
    }
}