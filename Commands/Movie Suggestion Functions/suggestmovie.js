const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const Vibrant = require('node-vibrant');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestmovie')
        .setDescription('Get movie suggestions based on genres and more!'),

    async execute(interaction) {
        try {
            const buttonsPerPage = 4; // Number of buttons per page
            let page = 1;

            const genres = [
                { customId: 'action', label: 'Action', emoji: '🎬', genreId: 28 },
                { customId: 'comedy', label: 'Comedy', emoji: '😂', genreId: 35 },
                { customId: 'drama', label: 'Drama', emoji: '🎭', genreId: 18 },
                { customId: 'horror', label: 'Horror', emoji: '👻', genreId: 27 },
                { customId: 'classic', label: 'Classics', emoji: '📽️', genreId: 12 },
                { customId: 'romance', label: 'Romance', emoji: '❤️', genreId: 10749 },
                { customId: 'sci-fi', label: 'Sci-Fi', emoji: '🚀', genreId: 878 },
                { customId: 'thriller', label: 'Thriller', emoji: '🔪', genreId: 53 }
            ];

            const totalPages = Math.ceil(genres.length / buttonsPerPage);

            const createActionRow = (page) => {
                const start = (page - 1) * buttonsPerPage;
                const end = start + buttonsPerPage;
                const pageGenres = genres.slice(start, end);

                const buttons = pageGenres.map(genre => 
                    new ButtonBuilder()
                        .setCustomId(genre.customId)
                        .setLabel(genre.label)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(genre.emoji)
                );

                if (page > 1) {
                    buttons.unshift(
                        new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                    );
                }

                if (page < totalPages) {
                    buttons.push(
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('➡️')
                    );
                }

                return new ActionRowBuilder().addComponents(buttons);
            };

            await interaction.reply({
                content: 'Pick a genre to get a movie suggestion!',
                components: [createActionRow(page)]
            });

            const filter = i => genres.map(g => g.customId).includes(i.customId) || i.customId === 'next' || i.customId === 'previous';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'next') {
                    page++;
                    await i.update({ components: [createActionRow(page)] });
                } else if (i.customId === 'previous') {
                    page--;
                    await i.update({ components: [createActionRow(page)] });
                } else {
                    const selectedGenre = genres.find(g => g.customId === i.customId);
                    const movie = await getAvailableMovieFromTMDB(selectedGenre.genreId);

                    if (!movie) {
                        await i.update({ content: '❌ Could not fetch a movie suggestion. Please try again later.', components: [] });
                        return;
                    }

                    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    const color = await extractDominantColor(posterUrl);
                    const streamingProviders = await getStreamingProviders(movie.id);
                    const providersText = streamingProviders.join(', ') || 'No streaming platforms available';

                    const cast = await getMovieCast(movie.id);
                    const castText = cast.slice(0, 3).map(actor => `**${actor.name}**`).join(', ') || 'No cast information available';

                    // Create the embed
                    const movieEmbed = new EmbedBuilder()
                        .setColor(color || '#1db954')
                        .setTitle(`🎬 **${movie.title}**`)
                        .setDescription(movie.overview || 'No description available.')
                        .setImage(posterUrl)
                        .addFields(
                            { name: '⭐ **Rating**', value: `${movie.vote_average} / 10`, inline: true },
                            { name: '📅 **Release Date**', value: moment(movie.release_date).format('MMMM Do, YYYY'), inline: true },
                            { name: '🎭 **Cast**', value: castText },
                            { name: '📺 **Available on**', value: providersText } // Display streaming platforms
                        )
                        .setFooter({ text: 'Movie Bot - Suggestion Powered by TMDB' });

                    // Update the original message with the movie suggestion
                    await i.update({
                        content: `Here’s a great movie suggestion for you: **${movie.title}**!`,
                        embeds: [movieEmbed],
                        components: [createActionRow(page)], // Keep the buttons for further suggestions
                    });
                }
            });

        } catch (error) {
            console.error('Error in /suggestmovie command:', error);
            await interaction.reply({ content: 'An error occurred while processing the movie suggestion.', ephemeral: true });
        }
    }
};

// Fetch a random available movie from TMDB based on genre and filter out adult content, "in theaters only" movies, and inappropriate titles
async function getAvailableMovieFromTMDB(genreId) {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&include_adult=false&language=en-US&sort_by=popularity.desc&release_date.lte=${moment().format('YYYY-MM-DD')}`;

    // List of keywords to block
    const blockedKeywords = ['sex', 'porn', 'erotic', 'nude', 'nudity', 'xxx', 'explicit'];

    try {
        const response = await axios.get(url);
        let movies = response.data.results.filter(movie => !movie.adult && !movie.in_theaters);

        // Further filter out movies with inappropriate titles
        movies = movies.filter(movie => {
            return !blockedKeywords.some(keyword => movie.title.toLowerCase().includes(keyword));
        });

        return movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;
    } catch (error) {
        console.error('Error fetching movie from TMDB:', error);
        return null;
    }
}

// Fetch streaming providers for the movie
async function getStreamingProviders(movieId) {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const providers = response.data.results.US?.flatrate || []; // Assuming we're looking for providers in the US
        return providers.map(provider => provider.provider_name);
    } catch (error) {
        console.error('Error fetching streaming providers:', error);
        return [];
    }
}

// Extract dominant color from the movie poster
async function extractDominantColor(imageUrl) {
    try {
        const palette = await Vibrant.from(imageUrl).getPalette();
        return palette.Vibrant.hex;
    } catch (error) {
        console.error('Error extracting color:', error);
        return '#1db954'; // Fallback color
    }
}

// Fetch cast information
async function getMovieCast(movieId) {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        return response.data.cast || [];
    } catch (error) {
        console.error('Error fetching movie cast:', error);
        return [];
    }
}
