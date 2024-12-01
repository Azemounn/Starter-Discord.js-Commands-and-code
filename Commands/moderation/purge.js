const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clear a given amount of messages from a target or channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => 
        option.setName('amount')
        .setDescription('Amount of messsages to clear.')
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true)
        )
    .addUserOption(option =>
        option.setName('target')
        .setDescription('Select a target to clear their messages.')
        .setRequired(false)
        ),
        
    async execute(interaction) {
        if (interaction.user.id != "273628029811687425") return await interaction.reply({ content: `This command is only for devs`, ephemeral: true});
        const {channel, options} = interaction;
        const amount = options.getInteger('amount');
        const target = options.getUser('target');

        const messages = await channel.messages.fetch({
            limit: amount +1,
        });

        const res = new EmbedBuilder()
            .setColor(0x00FFFB)

        if(target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) =>{
                if(msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`✅ Successfully deleted ${messages.size} messages from ${target}`);
                interaction.reply({embeds: [res], ephemeral: true});
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`✅ Successfully deleted ${messages.size} messages from the channel.`);
                interaction.reply({embeds: [res], ephemeral: true});
            });
        }
    }
}