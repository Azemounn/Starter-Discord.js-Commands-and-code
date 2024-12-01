const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moviesinfo')
        .setDescription('Get information about the movie features of the bot and setup instructions.'),
    async execute(interaction) {
        console.log('Executing /moviesinfo command');

        try {
            // Fetch the bot's avatar URL dynamically
            const botAvatarUrl = interaction.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 });

            // Create the main informative embed with better spacing
            const embed = new EmbedBuilder()
                .setColor('#6A0DAD') // Deep purple color for a premium feel
                .setTitle('🍿 Movie Bot: Features & Setup Guide')
                .setDescription('Explore all the amazing features of Movie Bot and learn how to set it up quickly!')
                .setThumbnail(botAvatarUrl) // Use the bot's avatar dynamically
                .addFields(
                    {
                        name: '✨ Movie Suggestions Made Easy',
                        value: 'Get instant movie recommendations based on genres with just a click! Admins can control the setup to ensure a smooth experience.\n\u200B',
                    },
                    {
                        name: '🎥 Available Genres',
                        value: '• **Action** 🎬\n• **Comedy** 😂\n• **Drama** 🎭\n• **Classics** 📽️\n• **More genres to discover...**\n\u200B',
                    },
                    {
                        name: '⚙️ Quick Admin Setup',
                        value: 'Users can request suggestions in the designated channel by using `/suggestmovie`.\n\u200B',
                    },
                    {
                        name: '📜 Commands Overview',
                        value: '• **/suggestmovie** - Get movie recommendations by genre.',
                    },
                )
                .setImage('https://image.tmdb.org/t/p/w500/sample-premium-image.jpg') // Replace with an actual premium image if needed
                .setFooter({ text: 'Movie Bot - Elevating your movie experience 🎬' })
                .setTimestamp(); // Add a timestamp for freshness

            // Send the embed without buttons
            await interaction.reply({
                embeds: [embed],
            });

            console.log('Successfully sent the /moviesinfo embed.');
        } catch (error) {
            console.error('Error in /moviesinfo command:', error);
            await interaction.reply({ content: '❌ An error occurred while retrieving the movie info. Please try again later.', ephemeral: true });
        }
    },
};
