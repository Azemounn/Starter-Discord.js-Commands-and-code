const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fortnite-stats")
    .setDescription("Get a user's fortnite stats!")
    .addStringOption((o) =>
      o
        .setName("username")
        .setDescription("the fortnite username to retrieve the stats from")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getString("username");
    const platform = interaction.options.getString("platform");
    const ApiKey = `cbb251b8-382f-485e-8fe2-13cb876c652c`;
    const options = {
      method: "GET",
      url: `https://fortnite-api.com/v2/stats/br/v2?name=${user}`,
      headers: {
        Authorization: `${ApiKey}`,
      },
    };

   try {
    
   
     const response = await axios.request(options);
      if (!response) return interaction.editReply({content: "Given user does not exist or has no stats.", ephemeral: true})
      const {account, battlePass, stats} = response.data.data
      const {overall} = stats.all

      const embed = new EmbedBuilder()
      .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s stats!`})
      .setColor('#2C2F33')
      .setDescription('Click the Buttons below to view the stats!\n\n**Overall stats:**')
      .addFields(
        {name: 'Wins', value: `${overall.wins.toLocaleString()}`, inline: true},
        {name: 'Score', value: `${overall.score.toLocaleString()}`, inline: true},
        {name: 'Kills', value: `${overall.kills.toLocaleString()}`, inline: true},
        {name: 'Deaths', value: `${overall.deaths.toLocaleString()}`, inline: true},
        {name: 'K/D', value: `${overall.kd}`, inline: true},
        {name: 'Matches', value: `${overall.matches.toLocaleString()}`, inline: true},
        {name: 'WR', value: `${overall.winRate}%`, inline: true},
        {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(overall.lastModified).getTime() / 1000)}:F>`},
      )

     const kbm = new ButtonBuilder()
        .setCustomId('kbm')
        .setEmoji('🖱')
        .setStyle(ButtonStyle.Secondary)
        
      const Console =  new ButtonBuilder()
        .setCustomId('console')
        .setEmoji('🎮')
        .setStyle(ButtonStyle.Secondary)

       const mobile = new ButtonBuilder()
        .setCustomId('mobile')
        .setEmoji('📱')
        .setStyle(ButtonStyle.Secondary)

      const row = new ActionRowBuilder().addComponents(
        kbm, Console, mobile
      );
      
      const kbmsolo = new ButtonBuilder()
        .setCustomId('kbmsolo')
        .setEmoji('1️⃣')
        .setLabel('View Solo Stats')
        .setStyle(ButtonStyle.Secondary)
        
       const kbmduo = new ButtonBuilder()
        .setCustomId('kbmduo')
        .setEmoji('2️⃣')
        .setLabel('View Duo\'s Stats')
        .setStyle(ButtonStyle.Secondary)

        const kbmsquad = new ButtonBuilder()
        .setCustomId('kbmsquad')
        .setEmoji('4️⃣')
        .setLabel('View Squad\'s Stats')
        .setStyle(ButtonStyle.Secondary)

      const kbmRow = new ActionRowBuilder().addComponents(
        kbmsolo, kbmduo, kbmsquad
      );

      const consolesolo = new ButtonBuilder()
        .setCustomId('consolesolo')
        .setEmoji('1️⃣')
        .setLabel('View Solo Stats')
        .setStyle(ButtonStyle.Secondary)
        
       const consoleduo = new ButtonBuilder()
        .setCustomId('consoleduo')
        .setEmoji('2️⃣')
        .setLabel('View Duo\'s Stats')
        .setStyle(ButtonStyle.Secondary)

        const consolesquad = new ButtonBuilder()
        .setCustomId('consolesquad')
        .setEmoji('4️⃣')
        .setLabel('View Squad\'s Stats')
        .setStyle(ButtonStyle.Secondary)

      const consolerow = new ActionRowBuilder().addComponents(
        consolesolo, consoleduo, consolesquad
      );

      const mobilesolo = new ButtonBuilder()
        .setCustomId('mobilesolo')
        .setEmoji('1️⃣')
        .setLabel('View Solo Stats')
        .setStyle(ButtonStyle.Secondary)
        
       const mobileduo = new ButtonBuilder()
        .setCustomId('mobileduo')
        .setEmoji('2️⃣')
        .setLabel('View Duo\'s Stats')
        .setStyle(ButtonStyle.Secondary)

        const mobilesquad = new ButtonBuilder()
        .setCustomId('mobilesquad')
        .setEmoji('4️⃣')
        .setLabel('View Squad\'s Stats')
        .setStyle(ButtonStyle.Secondary)

      const mobilerow = new ActionRowBuilder().addComponents(
        mobilesolo, mobileduo, mobilesquad
      );

      const {keyboardMouse, gamepad, touch} = stats

      if (!keyboardMouse) kbm.setDisabled(true)
      if (!gamepad) Console.setDisabled(true)
      if (!touch) mobile.setDisabled(true)
      const reply = await interaction.editReply({embeds: [embed], components: [row], fetchReply: true})
      const collector = reply.createMessageComponentCollector();

      collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) return i.reply({content: 'Only <@' + interaction.user.id + '> can use these buttons!', ephemeral: true})
        switch(i.customId) {
            case "kbm": {

                const all = keyboardMouse.overall
                const {solo, duo, squad} = keyboardMouse
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Keyboard and Mouse Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) kbmsolo.setDisabled(true)
                if (!duo) kbmduo.setDisabled(true)
                if (!squad) kbmsquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, kbmRow]})
            };
            break;
            case "mobile": {
                const all = touch.overall
                const {solo, duo, squad} = touch
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Mobile Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) mobilesolo.setDisabled(true)
                if (!duo) mobileduo.setDisabled(true)
                if (!squad) mobilesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, mobilerow]})
            };
            break;
            case "console": {
                const all = gamepad.overall
                const {solo, duo, squad} = gamepad
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Console Stats!`})
                .setColor('Red')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) consolesolo.setDisabled(true)
                if (!duo) consoleduo.setDisabled(true)
                if (!squad) consolesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, consolerow]})
            };
            break;
            case 'kbmsolo': {
                const all = keyboardMouse.solo
                const {solo, duo, squad} = keyboardMouse
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Keyboard and Mouse Solo Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) kbmsolo.setDisabled(true)
                if (!duo) kbmduo.setDisabled(true)
                if (!squad) kbmsquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, kbmRow]})

            }
            break;
            case 'kbmduo': {
                const all = keyboardMouse.duo
                const {solo, duo, squad} = keyboardMouse
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Keyboard and Mouse Duo Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) kbmsolo.setDisabled(true)
                if (!duo) kbmduo.setDisabled(true)
                if (!squad) kbmsquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, kbmRow]})

            }
            break;
            case 'kbmsquad': {

                const all = keyboardMouse.squad
                const {solo, duo, squad} = keyboardMouse
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Keyboard and Mouse Squad Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) kbmsolo.setDisabled(true)
                if (!duo) kbmduo.setDisabled(true)
                if (!squad) kbmsquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, kbmRow]})

            }
            break;
            case 'mobilesolo': {
                const all = touch.solo
                const {solo, duo, squad} = touch
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Mobile Solo Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) mobilesolo.setDisabled(true)
                if (!duo) mobileduo.setDisabled(true)
                if (!squad) mobilesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, mobilerow]})
            }
            break;
            case 'mobileduo': {

                const all = touch.duo
                const {solo, duo, squad} = touch
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Mobile Duo Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) mobilesolo.setDisabled(true)
                if (!duo) mobileduo.setDisabled(true)
                if (!squad) mobilesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, mobilerow]})

            }
            break;
            case 'mobilesquad': {

                const all = touch.squad
                const {solo, duo, squad} = touch
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Mobile Squad Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) mobilesolo.setDisabled(true)
                if (!duo) mobileduo.setDisabled(true)
                if (!squad) mobilesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, mobilerow]})

            }
            break;
            case 'consolesolo': {

                const all = gamepad.solo
                const {solo, duo, squad} = gamepad
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Console Solo Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) consolesolo.setDisabled(true)
                if (!duo) consoleduo.setDisabled(true)
                if (!squad) consolesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, consolerow]})

            }
            break;
            case 'consoleduo': {

                const all = gamepad.duo
                const {solo, duo, squad} = gamepad
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Console Duo Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) consolesolo.setDisabled(true)
                if (!duo) consoleduo.setDisabled(true)
                if (!squad) consolesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, consolerow]})

            }
            break;
            case 'consolesquad': {

                const all = gamepad.squad
                const {solo, duo, squad} = gamepad
                const Embed = new EmbedBuilder()
                .setAuthor({iconURL: interaction.user.displayAvatarURL(), name: `Viewing ${account.name}'s Console Squad Stats!`})
                .setColor('#2C2F33')
                .setDescription('Click the Buttons below to view the Solo, Duo, or Squad stats!\n\n**Overall stats:**')
                .addFields(
                    {name: 'Wins', value: `${all.wins.toLocaleString()}`, inline: true},
                    {name: 'Score', value: `${all.score.toLocaleString()}`, inline: true},
                    {name: 'Kills', value: `${all.kills.toLocaleString()}`, inline: true},
                    {name: 'Deaths', value: `${all.deaths.toLocaleString()}`, inline: true},
                    {name: 'K/D', value: `${all.kd}`, inline: true},
                    {name: 'Matches', value: `${all.matches.toLocaleString()}`, inline: true},
                    {name: 'WR', value: `${all.winRate}%`, inline: true},
                    {name: '(Stats Last Updated)', value: `<t:${parseInt(new Date(all.lastModified).getTime() / 1000)}:F>`},
                )

                if (!solo) consolesolo.setDisabled(true)
                if (!duo) consoleduo.setDisabled(true)
                if (!squad) consolesquad.setDisabled(true)

                await i.update({embeds: [Embed], components: [row, consolerow]})

            }
            break;

        }
      });
    } catch (e) {
        return interaction.editReply({content: 'That user can\'t be found or has no stats!', ephemeral: true})
    }
  },
};
