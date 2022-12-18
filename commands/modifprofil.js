const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { ownersID } = require('../config.json');
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
                    { name: "Ammo Productivity", value: "Ammo Productivity" },
                    { name: "Scrap Refinery", value: "Scrap Refinery" },
                    { name: "Scrap Productivity", value: "Scrap Productivity" },
                    { name: "Honeycomb Refining", value: "Honeycomb Refining" },
                    { name: "Honeycomb Productivity", value: "Honeycomb Productivity" },
                    { name: "Schematics Cost", value: "Schematics Cost" },
                    { name: "Schematics Productivity", value: "Schematics Productivity" }
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
            const rawdatatalents = fs.readFileSync(`./data/profils/${profil}.json`);
            const objdatatalents = JSON.parse(rawdatatalents);
        if (ownersID != interaction.member.id) {
            if (objdatatalents.Nom == "lvl0" || objdatatalents.Nom == "lvl1" || objdatatalents.Nom == "lvl2" || objdatatalents.Nom == "lvl3" || objdatatalents.Nom == "lvl4" || objdatatalents.Nom == "lvl5") {
                return interaction.reply({ content: `Essaie encore pour voir!`, ephemeral: true });
            }
            if (objdatatalents.Owner != interaction.member.id) {
                return interaction.reply({ content: `T'es pas le proprio, tu peux arrêter d'essayer! :)`, ephemeral: true });
            }
        }

        let txtTotal = "";

        if (talent != null && level != null && categorie == null && tier == null) {
            let talIndex = objdatatalents.TalentList.findIndex(ta => ta.Name === talent);
            objdatatalents.TalentList[talIndex].lvl = level;
            fs.writeFileSync(`./data/profils/${profil}.json`, JSON.stringify(objdatatalents));
            txtTotal += `- ${objdatatalents.TalentList[talIndex].Name} : ${objdatatalents.TalentList[talIndex].lvl}`;
        } else if (categorie != null && tier != null && level != null && talent == null) {
            txtTotal += `Catégorie "${categorie}" Tier ${tier} => \n`;

            for (const talentList of objdatatalents.TalentList) {
                if (categorie == talentList.categorie && tier == talentList.Tier) {
                    talentList.lvl = level;
                    txtTotal += `- ${talentList.Name} : ${talentList.lvl} \n`;
                }
            }
            fs.writeFileSync(`./data/profils/${profil}.json`, JSON.stringify(objdatatalents));
        }
        else {
            return interaction.reply({ content: `utiliser moi correctement svp`, ephemeral: true });
        }
        let ServiceEmbed = new EmbedBuilder()
            .setColor("0xFFA500")
            .setTitle(`Modification du profil: ${profil}`)
            .setTimestamp()
            .addFields(
                { name: 'Talent(s) mis à jour : ', value: txtTotal, inline: true },
            )
            .setFooter({ text: 'Made by Raitrax' });

        return interaction.reply({ embeds: [ServiceEmbed], ephemeral: true });
        } catch (err) {
            return interaction.reply("Profil invalide");
        }
        
    },
};
