const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Change the bot\'s profile picture.')
        .addAttachmentOption(option => 
            option.setName('image')
            .setDescription('Upload the new profile picture (JPEG, PNG, GIF, etc.)')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins
    async execute(interaction) {
        const attachment = interaction.options.getAttachment('image');
        const fileType = attachment.contentType;

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(fileType)) {
            return interaction.reply({ content: '❌ Invalid file type! Please upload a JPEG, PNG, or GIF.', ephemeral: true });
        }

        try {
            const imageData = await axios.get(attachment.url, { responseType: 'arraybuffer' });
            await interaction.client.user.setAvatar(imageData.data);
            await interaction.reply({ content: '✅ Successfully updated the bot\'s profile picture!', ephemeral: true });
        } catch (error) {
            console.error('Error updating avatar:', error);
            await interaction.reply({ content: '❌ An error occurred while updating the avatar.', ephemeral: true });
        }
    },
};
