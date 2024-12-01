const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits} = require('discord.js');
const musicSetup = require('../../Models/musicSetup');

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName('music-setup')
        .setDescription('Create your music panel')
        .addChannelOption(option => option.setName("channel").setDescription("The channel to send the panel in ").addChannelTypes(ChannelType.GuildText).setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;
        const { name, ownerID, createdTimestamp, memberCount } = guild;
        
        const embed = new EmbedBuilder()
        .setTitle('Now Playing!')
        .setDescription("music")
        .setColor('Aqua')

        await interaction.reply({content: "panel sent", ephemeral: true})

        const channel = interaction.options.getChannel("channel")
    
        const buttons = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId('play-pause')
                .setLabel('⏯️ | play/pause')
                .setStyle("Primary"),
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('⏹️ | Stop')
                .setStyle('Danger') ,   
            new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('⏭️ | Skip')
                .setStyle('Success'),
            new ButtonBuilder()
                .setCustomId("Queue")
                .setLabel('Queue')
                .setStyle('Secondary')
        );


        const message = await channel.send({embeds: [embed], components: [buttons]})
    
        const data = await musicSetup.findOne({guild: guild.id})
        if (!data) await musicSetup.create(
            {
                guild: guild.id,
                channel: channel.id,
                messageId: message.id,
            }
        )
        else await musicSetup.updateOne({guild: guild.id}, {channel: channel.id, messageId: message.id})
    }

}