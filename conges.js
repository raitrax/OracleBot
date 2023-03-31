const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Database = require('./database'); //importer votre module pour accéder à la base de données

module.exports = {
    data: new SlashCommandBuilder()
        .setName('congés')
        .setDescription('Donne la possibilité de prendre des congés')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur qui veut prendre des congés')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('jours')
                .setDescription('Le nombre de jours de congé à prendre')
                .setRequired(true)),
    async execute(interaction) {
        const utilisateur = interaction.options.getUser('utilisateur');
        const jours = interaction.options.getInteger('jours');
        const db = new Database(); //instancier la base de données

        //vérifier si l'utilisateur a déjà des jours de congé dans le compteur mensuel
        let compteur = await db.get(utilisateur.id) || 0;

        //vérifier si l'utilisateur a assez de jours de congé restants
        if (compteur + jours > 4) {
            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(`Désolé, ${utilisateur.username} n'a pas assez de jours de congé restants.`);
            return interaction.reply({ embeds: [embed] });
        }

        //ajouter les jours de congé au compteur mensuel de l'utilisateur
        compteur += jours;
        await db.set(utilisateur.id, compteur);

        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${utilisateur.username} a pris ${jours} jours de congé.`);
        return interaction.reply({ embeds: [embed] });
    },
};
