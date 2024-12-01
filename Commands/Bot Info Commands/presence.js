const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('presence')
        .setDescription('Change the bot\'s presence and status')
        .addStringOption(option => 
            option.setName('status')
            .setDescription('Set the bot\'s status')
            .setRequired(true)
            .addChoices(
                { name: 'online', value: 'online' },
                { name: 'idle', value: 'idle' },
                { name: 'dnd', value: 'dnd' },
                { name: 'invisible', value: 'invisible' }
            ))
        .addStringOption(option => 
            option.setName('activity')
            .setDescription('Set the activity type')
            .setRequired(true)
            .addChoices(
                { name: 'Playing', value: 'PLAYING' },
                { name: 'Streaming', value: 'STREAMING' },
                { name: 'Listening', value: 'LISTENING' },
                { name: 'Watching', value: 'WATCHING' },
                { name: 'Competing', value: 'COMPETING' }
            ))
        .addStringOption(option => 
            option.setName('message')
            .setDescription('Set the activity message')
            .setRequired(true)),
    async execute(interaction) {
        const status = interaction.options.getString('status');
        const activity = interaction.options.getString('activity');
        const message = interaction.options.getString('message');
        
        // Set bot's status and activity
        try {
            await interaction.client.user.setPresence({
                status: status,
                activities: [{
                    name: message,
                    type: activity
                }]
            });
            await interaction.reply({ content: `Presence updated to ${status} with activity ${activity}: "${message}"`, ephemeral: true });
        } catch (error) {
            console.error('Error updating presence:', error);
            await interaction.reply({ content: 'Failed to update presence. Please try again later.', ephemeral: true });
        }
    },
};
