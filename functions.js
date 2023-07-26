const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, RoleSelectMenuBuilder, MentionableSelectMenuBuilder, ChannelSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

const leagues = require("./models/leagues");

module.exports = {

    getHeures: function () {
        let currentdate = new Date();
        let currentHours = currentdate.getHours();
        currentHours = ("0" + currentHours).slice(-2);
        let currentMinutes = currentdate.getMinutes();
        currentMinutes = ("0" + currentMinutes).slice(-2);
        let datetime = currentHours + "h" + currentMinutes;
        return datetime;
    },
    service: async function (channel) {
        await channel.bulkDelete(99, true).catch(error => {
            console.error(error);
            channel.send({ content: 'Une erreur est survenue lors de la suppression des messages dans ce channel!', ephemeral: true });
        });


        let ServiceEmbed = new EmbedBuilder()
            .setColor('#EFFF00')
            .setTitle(`Bienvenue sur le serveur Oracle!\nWelcome in Oracle's server!`)
            .setDescription(`Veuillez choisir votre role et votre ligue!\nChoose your role and your league!`)//.setAuthor({ name: 'Oracle' })
            //.setTimestamp()
            //.setFooter({ text: 'Oracle' })
            ;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('DPS')
                    .setLabel('DPS')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('TROLL')
                    .setLabel('TROLL')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('HEAL')
                    .setLabel('HEAL')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('TANK')
                    .setLabel('TANK')
                    .setStyle(ButtonStyle.Secondary),
            );

        const leagueSelection = await leagues.findAll();

        const menu = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Choisissez votre ligue/Choose your League')
            .addOptions(leagueSelection.map(league => { return { label: league.name, value: league.roleId } }))
        const row1 = new ActionRowBuilder()
            .addComponents(menu);
        await channel.send({ embeds: [ServiceEmbed], components: [row, row1] });
    },
}