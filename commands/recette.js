const { SlashCommandBuilder, AutocompleteInteraction } = require('discord.js');
const functions = require('../functions');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('recette')
        .setDescription("recetteDU")
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction) {
        const value = interaction.options.getString('input');
        console.log("ajout test");
        var list = [];
        await functions.recetteSearch(value, 10, list);
        //setTimeout(() => {
        // console.log("Retardée d'une seconde.");
        console.log(list);
        console.log(list.length);
        //}, "3000")
        return interaction.reply({ content: `test fait : ${value}`, ephemeral: true });
    },
};