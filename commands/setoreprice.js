const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { ownersID } = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setoreprice')
        .setDescription('Parametrage des prix des minerais')
        .addStringOption(option =>
            option.setName('ore')
                .setDescription(`A utiliser avec tier et lvl`)
                .setRequired(true)
                .addChoices(
                    { name: "Hematite", value: "Hematite" },
                    { name: "Bauxite", value: "Bauxite" },
                    { name: "Coal", value: "Coal" },
                    { name: "Quartz", value: "Quartz" },
                    { name: "Chromite", value: "Chromite" },
                    { name: "Natron", value: "Natron" },
                    { name: "Limestone", value: "Limestone" },
                    { name: "Malachite", value: "Malachite" },
                    { name: "Pyrite", value: "Pyrite" },
                    { name: "Petalite", value: "Petalite" },
                    { name: "Garnierite", value: "Garnierite" },
                    { name: "Acanthite", value: "Acanthite" },
                    { name: "Gold Nuggets", value: "Gold Nuggets" },
                    { name: "Cobaltite", value: "Cobaltite" },
                    { name: "Cryolite", value: "Cryolite" },
                    { name: "Kolbeckite", value: "Kolbeckite" },
                    { name: "Rhodonite", value: "Rhodonite" },
                    { name: "Columbite", value: "Columbite" },
                    { name: "Illmenite", value: "Illmenite" },
                    { name: "Vanadinite", value: "Vanadinite" }
                ),
        )
        .addIntegerOption(option =>
            option.setName('prix')
                .setDescription(`Prix du minerais`)
                .setRequired(true)
        ),
    async execute(interaction) {
        const ore = interaction.options.getString('ore');
        const prix = interaction.options.getInteger('prix');

        try {
            rawdataoreprice = fs.readFileSync(`./data/oreprice.json`);
        } catch (err) {
            return interaction.reply("Fichier prix absent");
        }
        const objdataoreprice = JSON.parse(rawdataoreprice);
        var orepriceIndex = objdataoreprice.findIndex(ta => ta.Name === ore);
        var oldPrice = objdataoreprice[orepriceIndex].Price;
        objdataoreprice[orepriceIndex].Price = prix;

        fs.writeFileSync(`./data/oreprice.json`, JSON.stringify(objdataoreprice));


        ServiceEmbed = new EmbedBuilder()
            .setColor("0xFFA500")
            .setTitle(`Modification du prix du minerais : ${ore}`)
            //.setAuthor({ name: 'Raitrax' })
            .setTimestamp()
            .addFields(
                //{ name: 'Elements', value: txtElements, inline: true },
                { name: 'Ancien prix : ', value: `${oldPrice}h`, inline: true },
                { name: 'Nouveau prix : ', value: `${prix}h`, inline: true },
            )
            .setFooter({ text: 'Made by Raitrax' });

        return interaction.reply({ embeds: [ServiceEmbed], ephemeral: true });
    },
};
