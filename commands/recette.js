const { SlashCommandBuilder, EmbedBuilder, AutocompleteInteraction } = require('discord.js');
const functions = require('../functions');
const fs = require('fs');
const { isOre } = require('../functions');
const schematic = './data/schematic.json';
const rawdataschematic = fs.readFileSync(schematic);
const objdataschematic = JSON.parse(rawdataschematic);

const recipes = './data/recipes_api_dump.json';
const rawdatarecipes = fs.readFileSync(recipes);
var objdatarecipes = JSON.parse(rawdatarecipes);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recette')
        .setDescription("recetteDU")
        .addStringOption(option =>
            option.setName('input')
                .setDescription(`L'élément à crafter`)
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addIntegerOption(option =>
            option.setName('nombre')
                .setDescription(`Nombre d'élément`)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('profil')
                .setDescription(`Profil de crafter`)
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction) {
        const input = interaction.options.getString('input');
        const nombre = interaction.options.getInteger('nombre');
        const profil = interaction.options.getString('profil');
        try {
            var objRecipesTalented = await functions.loadTalent(profil, objdatarecipes);

            console.log("ajout test");
            var list = [];
            await functions.recetteSearch(input, nombre, list, objRecipesTalented);
            //setTimeout(() => {
            // console.log("Retardée d'une seconde.");
            console.log(list);
            //console.log(list.length);
            var schematicsList = [];
            for (let index = 0; index < list.length; index++) {
                var index2 = schematicsList.map(object => object.name).indexOf(list[index].schematics);

                if (index2 != -1) {
                    schematicsList[index2].nb += list[index].schematicsQuantity;
                } else {
                    schematicsList.push({ name: list[index].schematics, nb: list[index].schematicsQuantity });
                }

            }
            console.log(schematicsList);
            var txtElements = "";
            var txtSchematics = "";
            var txtTotal = "";
            for (let index3 = 0; index3 < list.length; index3++) {
                txtElements += `- ${list[index3].item} : ${list[index3].itemQuantity}\n`;
                let ore = await functions.isOre(list[index3].item);
                //console.log(ore);
                if (ore) {
                    txtTotal += `- ${list[index3].item} : ${list[index3].itemQuantity}\n`;
                }
            }
            var totalPrice = 0;
            for (let index4 = 0; index4 < schematicsList.length; index4++) {
                var index5 = objdataschematic.map(object => object.Name).indexOf(schematicsList[index4].name);
                var price = objdataschematic[index5].UnitPrice * schematicsList[index4].nb;
                totalPrice += price;
                txtSchematics += `- ${schematicsList[index4].name} : ${schematicsList[index4].nb} | ${price}h \n`;
            }
            txtSchematics += `Total : ${totalPrice}h \n`;
            ServiceEmbed = new EmbedBuilder()
                .setColor("0xFFA500")
                .setTitle(`${nombre}x ${input} | Profil: ${profil}`)
                //.setAuthor({ name: 'Raitrax' })
                .setTimestamp()
                .addFields(
                    //{ name: 'Elements', value: txtElements, inline: true },
                    { name: 'Ore/Minerai nécessaire : ', value: txtTotal, inline: true },
                    { name: 'Schematics : ', value: txtSchematics, inline: true },
                )
                .setFooter({ text: 'Made by Raitrax' });

            return interaction.reply({ embeds: [ServiceEmbed] });
        } catch (error) {
            interaction.reply(`Essaie encore!`);
        }



    },
};