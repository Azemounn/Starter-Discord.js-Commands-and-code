const { SlashCommandBuilder, Permissions, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolewipe')
        .setDescription('Removes all roles from a specified member')
        .setDefaultPermission(false)
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to remove all roles from')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason the member is getting role stripped')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('member');
        const reason = interaction.options.getString('reason');
        const executor = interaction.user;

        try {
            const member = await interaction.guild.members.fetch(user.id);

            if (!member || !member.roles) {
                return interaction.reply({ content: 'Failed to find the member or access their roles.', ephemeral: false });
            }

            const rolesRemoved = [];
            const errors = [];

            for (const role of member.roles.cache.values()) {
                if (role.id !== interaction.guild.id) {
                    try {
                        await member.roles.remove(role.id);
                        rolesRemoved.push(role);
                    } catch (error) {
                        console.error(`Failed to remove role ${role.name}: ${error}`);
                        errors.push(role);
                    }
                }
            }

            if (errors.length > 0) {
                return interaction.reply({ content: `Failed to remove some roles: ${errors.map(r => r.name).join(', ')}`, ephemeral: true });
            }

            const embed = new MessageEmbed()
                .setColor(0x00FF00)
                .setDescription(`**User:**\n<@${user.id}>\n\n**Process Update**\nThe role strip process is now starting and will be completed within the next few seconds!\n\n**Reason:**\n${reason}\n\n**Note:**\nPlease make sure the bot role is above all the user's roles to ensure all roles get wiped!\n\n**Command Ran By:**\n<@${executor.id}>`);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('accept')
                        .setLabel('Accept')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('deny')
                        .setLabel('Deny')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('addRolesBack')
                        .setLabel('Add Roles Back')
                        .setStyle('PRIMARY')
                );

            await interaction.reply({ content: `Are you sure you want to remove all roles from <@${user.id}>?`, components: [row] });

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'accept') {
                    await i.update({ content: 'Roles have been successfully removed.', embeds: [embed], components: [] });
                } else if (i.customId === 'deny') {
                    await i.update({ content: 'Role removal cancelled.', components: [] });
                } else if (i.customId === 'addRolesBack') {
                    try {
                        await member.roles.add(rolesRemoved);
                        await i.update({ content: 'Roles have been successfully added back.', components: [] });
                    } catch (error) {
                        console.error(`Failed to add roles back: ${error}`);
                        await i.update({ content: `Error occurred while adding roles back: ${error.message}`, components: [] });
                    }
                }
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
                    await interaction.editReply({ content: 'Action timed out. No roles were removed.', components: [] });
                } else {
                    await interaction.editReply({ components: [] });
                }
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `Error occurred: ${error.message}`, ephemeral: true });
        }
    }
};
