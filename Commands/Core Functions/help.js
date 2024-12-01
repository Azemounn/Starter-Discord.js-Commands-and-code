const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with Freakybot commands'),
    async execute(interaction) {
        try {
            // Get the bot's current avatar and banner dynamically
            const botAvatar = interaction.client.user.displayAvatarURL();
            const botBanner = 'https://your-dynamic-banner-url.gif'; // Update dynamically if you have a banner URL changing logic

            // General info embed
            const generalInfoEmbed = new EmbedBuilder()
                .setColor('#00FFAA') // Choose an attractive color
                .setTitle('🎉 Welcome to Freakybot!')
                .setDescription('Freakybot is your ultimate utility and entertainment bot, bringing you features for movie recommendations, birthday celebrations, and much more! Use the buttons below to explore specific commands related to Movies or Birthdays.')
                .setThumbnail(botAvatar) // Bot's dynamic profile picture
                .setImage(botBanner) // Bot's dynamic banner image
                .addFields(
                    { name: '🎬 Movie System', value: 'Get instant movie suggestions based on your favorite genres!' },
                    { name: '🎂 Birthday System', value: 'Celebrate birthdays, server anniversaries, and custom events with style!' },
                    { name: '💡 How It Works', value: 'Use the buttons below to explore movie commands or birthday commands for more specific instructions.' }
                )
                .setFooter({ text: 'Freakybot - Bringing utility and fun to your server!' })
                .setTimestamp();

            // Create buttons for Movies and Birthday categories
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('movie_commands')
                    .setLabel('🎬 Movie Commands')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('birthday_commands')
                    .setLabel('🎂 Birthday Commands')
                    .setStyle(ButtonStyle.Success)
            );

            // Send the initial embed with buttons and set a 2-minute timeout to disable buttons
            const reply = await interaction.reply({ embeds: [generalInfoEmbed], components: [row], fetchReply: true });

            // Wait for 2 minutes before disabling the buttons
            setTimeout(async () => {
                const disabledRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('movie_commands')
                        .setLabel('🎬 Movie Commands')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('birthday_commands')
                        .setLabel('🎂 Birthday Commands')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                );

                await interaction.editReply({ embeds: [generalInfoEmbed], components: [disabledRow] });
            }, 120000); // 2-minute timeout
        } catch (error) {
            console.error('Error in /help command:', error);
            await interaction.reply({ content: '❌ An error occurred while showing the help command.', ephemeral: true });
        }
    }
};
