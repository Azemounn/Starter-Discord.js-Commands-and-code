const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const welcome = require('../../Models/welcome'); // Fix the file path for no errors
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Manage your welcome system')
    .addSubcommand(command => command.setName('setup').setDescription('Sets up your welcome system').addChannelOption(option => option.setName('channel').setDescription('Please select a channel for the welcome system').addChannelTypes(ChannelType.GuildText).setRequired(true)).addStringOption(option => option.setName('message').setDescription('The message that gonna be send Note: use {member} to ping and (member) to show username').setRequired(true)).addStringOption(option => option.setName('reaction').setDescription('The reaction for your system').setRequired(false)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables your welcome system')),
    async execute (interaction) {
 
        const { options } = interaction;
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You dont have permisson to use the this command', ephemral: true });
 
        const sub = options.getSubcommand();
        const data = await welcome.findOne({ Guild: interaction.guild.id });
 
        switch (sub) {
            case 'setup':
 
            if (data) {
                return await interaction.reply({ content: 'The welcome system is already been setup use /welcome disable to disable the welcome system', ephemral: true })
            } else {
                const channel = options.getChannel('channel');
                const message = options.getString('message');
                const reaction = options.getString('reaction');
 
                await welcome.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Message: message,
                    Reaction: reaction
                });
 
                const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ Your welcome system has been setup with the message: \`${message}\`and it will be sent ${channel}`)
 
                await interaction.reply({ embeds: [embed], ephemral: true });
            }
 
                break;
 
            case 'disable':
 
            if (!data) {
                await interaction.reply({ content: 'The welcome system has not been setup please use /welcome setup to setup the system', ephemral: true });
            } else {
                await welcome.deleteMany({ Guild: interaction.guild.id });
 
                const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ Your welcome system has been Disabled`)
 
                await interaction.reply({ embeds: [embed], ephemral: true });
            }
                break;
        }
    }
}