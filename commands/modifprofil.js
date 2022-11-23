const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modifprofil')
        .setDescription('Gère les talents des profils')
        .addStringOption(option =>
            option.setName('profil')
                .setDescription(`Choix du profil`)
                .setAutocomplete(true)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('talent')
                .setDescription(`A utiliser avec lvl`)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('categorie')
                .setDescription(`A utiliser avec tier et lvl`)
                .addChoices(
                    { name: "Ore Refining", value: "Ore Refining" },
                    { name: "Product Refining", value: "Product Refining" },
                    { name: "Fuel Refining", value: "Fuel Refining" },
                    { name: "Pure Productivity", value: "Pure Productivity" },
                    { name: "Product Productivity", value: "Product Productivity" },
                    { name: "Fuel Productivity", value: "Fuel Productivity" },
                    { name: "Intermediary Part", value: "Intermediary Part" },
                    { name: "Ammo Productivity", value: "Ammo Productivity" }
                ),
        )
        .addIntegerOption(option =>
            option.setName('tier')
                .setDescription(`A utiliser avec categorie et lvl`)
                .addChoices(
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 }
                ),
        )
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription(`nom du profil`)
                .addChoices(
                    { name: '0', value: 0 },
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 }
                ),
        ),
    async execute(interaction) {
        const profil = interaction.options.getString('profil');
        const talent = interaction.options.getString('talent');
        const categorie = interaction.options.getString('categorie');
        const tier = interaction.options.getInteger('tier');
        const level = interaction.options.getInteger('level');

        try {
            rawdatatalents = fs.readFileSync(`./data/profils/${profil}.json`);
        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            return interaction.reply("Profil invalide");
        }
        const objdatatalents = JSON.parse(rawdatatalents);

        if (talent != null && level != null && categorie == null && tier == null) {
            var talIndex = objdatatalents.findIndex(ta => ta.Name === talent);
            objdatatalents[talIndex].lvl = level;
            fs.writeFileSync(`./data/profils/${profil}.json`, JSON.stringify(objdatatalents));
            interaction.reply(`Talent : ${talent} mis à jour au niveau : ${level} sur le profil : ${profil}`);
        } else if (categorie != null && tier != null && level != null && talent == null) {
            for (let index = 0; index < objdatatalents.length; index++) {
                if (categorie == objdatatalents[index].categorie && tier == objdatatalents[index].Tier) {
                    objdatatalents[index].lvl = level;
                }
            }
            fs.writeFileSync(`./data/profils/${profil}.json`, JSON.stringify(objdatatalents));
            interaction.reply(`Categorie : ${categorie} du Tier : ${tier} mis à jour au niveau : ${level} sur le profil : ${profil}`);
        }
        else {
            interaction.reply("utiliser moi correctement svp");
        }

    },
};
