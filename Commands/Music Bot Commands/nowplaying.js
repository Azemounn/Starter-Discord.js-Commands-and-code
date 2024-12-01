const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const pms = require("pretty-ms");

module.exports = {
    premiumOnly: true,
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Display info about the currently playing song."),
    async execute(interaction, client) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;
        const { name, ownerID, createdTimestamp, memberCount } = guild;

        if (!voiceChannel) {
            return interaction.reply({ content: "You must be in a voice channel to execute music commands.", ephemeral: true });
        }

        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            return interaction.reply({ content: `You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`, ephemeral: true });
        }

        try {
            const queue = await client.distube.getQueue(voiceChannel);

            if (!queue) {
                return interaction.reply({ content: "There is no active queue.", ephemeral: true });
            }

            const song = queue.songs[0];

            // Check if there is a currently playing song
            if (!song) {
                return interaction.reply({ content: "There is no song currently playing.", ephemeral: true });
            }

            const uni = `${queue.songs[0].playing ? '⏸️' : '▶️'}`; // Pause or Play button
            const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);

            const embed = new EmbedBuilder()
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

            // Add buttons for playback control
            const buttons = new ActionRowBuilder().setComponents(
                new ButtonBuilder()
                    .setCustomId('play-pause')
                    .setLabel('⏯️ | play/pause')
                    .setStyle("Primary"),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('⏭️ | Skip')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('⏹️ | Stop')
                    .setStyle('Danger')
            );

            
            return interaction.reply({ embeds: [embed], components: [buttons] });
            

            


        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "⛔ Something went wrong...", ephemeral: true });
        }
    },
};

// Volume progress bar
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