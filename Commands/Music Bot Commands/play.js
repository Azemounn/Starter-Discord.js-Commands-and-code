const { EmbedBuilder, SlashCommandBuilder, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ButtonInteraction } = require("discord.js");


module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Provide the name or url for the song.")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        await interaction.deferReply()
        const { options, member, guild, channel } = interaction;
        const { name, ownerID, createdTimestamp, memberCount } = guild;

        const query = options.getString("query");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("You must be in a voice channel to execute music commands.");
            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription(`You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
        
        
        await client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
        
        const queue = await client.distube.getQueue(voiceChannel);
        
            const uni = `${queue.songs[0].playing ? '⏸️' : '▶️'}`; // Pause or Play button
            const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);
            const song = queue.songs[0];

            const Embed = new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setTitle('Now Playing')
                .setDescription(`**[${song.name}](${song.url})**`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: '\u200b', value: '\u200b' },
                    { name: '🫰 | Requested by', value: `${song.user}`, inline: true },
                    { name: '👀 | Views', value: `${queue.songs[0].views.toLocaleString()}`, inline: true },
                    { name: '👍 | Likes', value: `${queue.songs[0].likes}`, inline: true },
                    { name: `🔊 | Volume`, value: `${ProgressVolumeBar(queue)}` },
                    { name: `⏳ | Current Duration: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`${uni} ${'─'.repeat(part) + '🎶' + '─'.repeat(30 - part)}\`\`\``, inline: false },
                )
                .setFooter({ text: 'Music Provided By Immune Bot', iconURL: 'https://cdn.discordapp.com/avatars/1147820967591157830/f97ad2e9e2d84dd984b3c566110c1068.png' })
                .setTimestamp()
                .setAuthor({ name: name });

        try {

            
             const buttons = new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setCustomId('play-pause')
                    .setLabel('⏯️ | play/pause')
                    .setStyle("Primary"),
                new ButtonBuilder()
                    .setCustomId('now-playing')
                    .setLabel('🎶 | Now-Playing')
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


               // Handle skip button directly here
               interaction.editReply({ embeds: [Embed], components: [buttons] }).then(() => {
                const filter = i => i.customId === 'skip' && i.user.id === interaction.user.id;
                const skipCollector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                skipCollector.on('collect', async i => {
                    try {
                        await i.deferReply();
                        await client.distube.skip(guild.id);
                        await i.editReply(`⏭️ Skipped to the next song.`);
                    } catch (error) {
                        console.error(error);
                    }
                });

                skipCollector.on('end', collected => {
                    if (collected.size === 0) {
                        // Handle what happens if the user doesn't click the button
                    }
                });

                // Handle play/pause button here
                const playPauseCollector = interaction.channel.createMessageComponentCollector();

                playPauseCollector.on('collect', async i => {
                    try {
                        if (i.customId == 'play-pause') {
                            await i.deferReply();
                            const isPlaying = queue.playing;
                            if (isPlaying) {
                                await queue.pause(i.member.voice.channel);
                                await i.editReply(`⏸️ Paused playback.`);
                            } else {
                                await queue.resume(i.member.voice.channel);
                                await i.editReply(`▶️ Resumed playback.`);
                            }
                            }
                    } catch (error) {
                        console.error(error);
                        console.log(queue)
                    }
                });

                playPauseCollector.on('end', collected => {
                    if (collected.size === 0) {
                        // Handle what happens if the user doesn't click the button
                    }
                });
            });
        } catch (err) {
            console.log(err);

            embed.setColor("Red").setDescription("⛔ | Something went wrong...");

            interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    }
}

function ProgressVolumeBar(player) {
    const full = "▰";
    const empty = "▱";
    const max = 15;
    const maxVolume = 150;
    const volume = typeof player.volume === "number" ? player.volume : 100;
    const capped = Math.min(volume, maxVolume);
    const filled = Math.floor((capped / maxVolume) * max);
    const empty_bar = max - filled;

    return `**${full.repeat(filled)}${empty.repeat(empty_bar)}**`;
}