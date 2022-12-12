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
            rawdatatalents = fs.readFileSync(`./data/profils/${profil}.json`);
        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            return interaction.reply("Profil invalide");
        }
        const objdatatalents = JSON.parse(rawdatatalents);
        if (ownersID != interaction.member.id) {
            if (objdatatalents.Nom == "lvl0" || objdatatalents.Nom == "lvl1" || objdatatalents.Nom == "lvl2" || objdatatalents.Nom == "lvl3" || objdatatalents.Nom == "lvl4" || objdatatalents.Nom == "lvl5") {
                return interaction.reply({ content: `Essaie encore pour voir!`, ephemeral: true });
            }
            if (objdatatalents.Owner != interaction.member.id) {
                return interaction.reply({ content: `T'es pas le proprio, tu peux arrêter d'essayer! :)`, ephemeral: true });
            }
        }

        var txtTotal = "";

        if (talent != null && level != null && categorie == null && tier == null) {
            var talIndex = objdatatalents.TalentList.findIndex(ta => ta.Name === talent);
            objdatatalents.TalentList[talIndex].lvl = level;
            fs.writeFileSync(`./data/profils/${profil}.json`, JSON.stringify(objdatatalents));
            txtTotal += `- ${objdatatalents.TalentList[talIndex].Name} : ${objdatatalents.TalentList[talIndex].lvl}`;
            //interaction.reply(`Talent : ${talent} mis à jour au niveau : ${level} sur le profil : ${profil}`);
        } else if (categorie != null && tier != null && level != null && talent == null) {
            txtTotal += `Catégorie "${categorie}" Tier ${tier} => \n`;

            for (let index = 0; index < objdatatalents.TalentList.length; index++) {
                if (categorie == objdatatalents.TalentList[index].categorie && tier == objdatatalents.TalentList[index].Tier) {
                    objdatatalents.TalentList[index].lvl = level;
                    txtTotal += `- ${objdatatalents.TalentList[index].Name} : ${objdatatalents.TalentList[index].lvl} \n`;
                }
            }
            fs.writeFileSync(`./data/profils/${profil}.json`, JSON.stringify(objdatatalents));
            //interaction.reply(`Categorie : ${categorie} du Tier : ${tier} mis à jour au niveau : ${level} sur le profil : ${profil}`);
        }
        else {
            return interaction.reply({ content: `utiliser moi correctement svp`, ephemeral: true });
        }
        ServiceEmbed = new EmbedBuilder()
            .setColor("0xFFA500")
            .setTitle(`Modification du profil: ${profil}`)
            //.setAuthor({ name: 'Raitrax' })
            .setTimestamp()
            .addFields(
                //{ name: 'Elements', value: txtElements, inline: true },
                { name: 'Talent(s) mis à jour : ', value: txtTotal, inline: true },
            )
            .setFooter({ text: 'Made by Raitrax' });

        return interaction.reply({ embeds: [ServiceEmbed], ephemeral: true });
    },
};
