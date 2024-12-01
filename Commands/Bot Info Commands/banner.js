const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Change the bot\'s banner image (Admins only).')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addAttachmentOption(option => 
            option.setName('banner')
                .setDescription('Upload the new banner image (GIFs or static images).')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            // Defer the reply to prevent the interaction from expiring
            await interaction.deferReply({ ephemeral: true });

            // Dynamically import node-fetch
            const fetch = (await import('node-fetch')).default;

            // Get the uploaded file
            const bannerAttachment = interaction.options.getAttachment('banner');
            if (!bannerAttachment) {
                return interaction.editReply({ content: '❌ No banner image provided.' });
            }

            // Validate file type (only allow GIF, PNG, JPG)
            const validTypes = ['image/gif', 'image/png', 'image/jpeg'];
            if (!validTypes.includes(bannerAttachment.contentType)) {
                return interaction.editReply({ content: '❌ Invalid file type. Only GIF, PNG, and JPG are allowed.' });
            }

            // Fetch the file from the provided URL
            const response = await fetch(bannerAttachment.url);
            if (!response.ok) {
                throw new Error('Failed to fetch the banner image.');
            }

            const arrayBuffer = await response.arrayBuffer(); // Get the image as an ArrayBuffer

            // Set the banner image using Discord API (Ensure your bot has the necessary permissions)
            await interaction.client.user.setBanner(Buffer.from(arrayBuffer));

            await interaction.editReply({ content: '✅ The bot\'s banner has been updated successfully!' });

        } catch (error) {
            console.error('Error in /banner command:', error);
            await interaction.editReply({ content: '❌ An error occurred while updating the banner.' });
        }
    },
};
