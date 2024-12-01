const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`automod`)
    .setDescription(`Setup the AutoMod System `)
    .addSubcommand(command => command.setName(`flagged-words`).setDescription(`Block profanity, sexual content, and slurs`))
    .addSubcommand(command => command.setName(`spam-messages`).setDescription(`Block messages suspected of spam`))
    .addSubcommand(command => command.setName(`mention-spam`).setDescription(`Block message containing a certain amount of mentions`).addIntegerOption(option => option.setName(`number`).setDescription(`The number of mentions required to block a message`).setRequired(true)))
    .addSubcommand(command => command.setName(`keyword`).setDescription(`Block a given keyword in the server`).addStringOption(option => option.setName(`word`).setDescription(`The word you want to block`).setRequired(true))),

    async execute ( interaction ) {
        
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You do not have the perms to setup AutoMod Within this server!`, ephemeral: true})
        
        switch (sub) {
            case `flagged-words`:

            await interaction.reply({content: `<a:Loading:1146361617764843560> Loading your AutoMod rule... `});

            const rule = await guild.autoModerationRules.create({
                name: `Block Profanity, Sexual Content, and Slurs by SabineBOT`,
                creatorId: "1143199032634789988", 
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                    {
                        presets: [1,2,3]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This messagee was prevented by SabineBot's Auto Moderation.`
                        }
                    }
                ]
            }).catch(async err =>{
                console.setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            }) 
            
            setTimeout(async () => {
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your AutoMod Rule has been created, All Profanity and Blocked Words will now be stopped by SabineBot!`)

                await interaction.editReply({ content: ``, embeds:[embed]});
            }, 3000)
        
            break;

            case `keyword`:

            await interaction.reply({content: `<a:Loading:1146361617764843560> Loading your AutoMod rule... `});
            const word = options.getString(`word`)
            console.log(word)

            const rule2 = await guild.autoModerationRules.create({
                name: `Prevent The word ${word} from being used by SabineBot`,
                creatorId: "1143199032634789988", 
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata:
                    {
                       keywordFilter:[`${word}`]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This messagee was prevented by SabineBot's Auto Moderation.`
                        }
                    }
                ]
            }).catch(async err =>{
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            }) 
            
            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your AutoMod Rule has been created, All Message containing the word ${word}  will be deleted by SabineBot!`)

                await interaction.editReply({ content: ``, embeds:[embed2]});
            }, 3000)

            break;

            case `spam-messages`:

            await interaction.reply({content: `<a:Loading:1146361617764843560> Loading your AutoMod rule... `});
            const number = options.getInteger(`number`);

            const rule3 = await guild.autoModerationRules.create({
                name: `Prevent Spam messages by SabineBot`,
                creatorId: "1143199032634789988", 
                enabled: true,
                eventType: 1,
                triggerType: 3,
                triggerMetadata:
                    {
                     
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This messagee was prevented by SabineBot's Auto Moderation.`
                        }
                    }
                ]
            }).catch(async err =>{
                console.setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            }) 
            
            setTimeout(async () => {
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your AutoMod Rule has been created, All Message suspected of spam will be deleted by SabineBot!`)

                await interaction.editReply({ content: ``, embeds:[embed3]});
            }, 3000)

            break;

            case `mention-spam`:

            await interaction.reply({content: `<a:Loading:1146361617764843560> Loading your AutoMod rule... `});
            const number2 = options.getInteger(`number`);

            const rule4 = await guild.autoModerationRules.create({
                name: `Prevent Spam Mentions by SabineBot`,
                creatorId: "1143199032634789988", 
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata:
                    {
                        mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This messagee was prevented by SabineBot's Auto Moderation.`
                        }
                    }
                ]
            }).catch(async err =>{
                console.setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            }) 
            
            setTimeout(async () => {
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your AutoMod Rule has been created, All Message containing the word ${word}  will be deleted by SabineBot!`)

                await interaction.editReply({ content: ``, embeds:[embed4]});
            }, 3000)

            
        }
    }
}   

