const {SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const superagent = require("superagent");
const onlyEmoji = require(`emoji-aware`).onlyEmoji;

module.exports = {
    data: new SlashCommandBuilder()
    .setName("emojimixer")
    .setDescription(`Combine two Different Emojis`)
    .addStringOption(option => option.setName(`emoji`).setDescription(`The emojis to combine`).setRequired(true)),
    async execute (interaction) {
        await interaction.deferReply({ephemeral: true});

        const { options } = interaction;
        const estring = options.getString(`emojis`);
        const input = onlyEmoji(estring);
        const response = `One or both of these emojis (\`${estring}\`) are not supported. Keep in mind that gestures (ie. thumbsup) and custom server emojis are not supported. `;

        const output = await superagent.get(`https://tenor.googleapis.com/v2/featured`)
        .query({
            key: `AIzaSyAEwqXm88gbuWc3ZUxv2Vg2JhiArzI17Xg`,
            contentfilter: "high", 
            media_filter: "png_transparent",
            component: 'proactive',
            collection: 'emoji_kitchen_v5',
            q: input.join(`_`)
        }).catch(err => {});
 
        if (!output) {
            return await interaction.editReply({ content: response });
        } else if (!output.body.results[0]){
            return await interaction.editReply({ content: response });
        } else if (estring.startsWith(`<`) || estring.endsWith(`>`)) {
            return await interaction.editReply({ content: response });
        }

        const embed = new EmbedBulder()
        .setColor("Blurple")
        .setImage(output.body.results[0].url)

        await interaction.editReply({ embeds: [embed ]});

    }
}