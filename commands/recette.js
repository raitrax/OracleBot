const { SlashCommandBuilder, EmbedBuilder, AutocompleteInteraction } = require('discord.js');
const functions = require('../functions');
const fs = require('fs');
const { isOre } = require('../functions');
const schematic = './data/schematic.json';
const rawdataschematics = fs.readFileSync(schematic);

const oreprice = './data/oreprice.json';
const rawdataoreprice = fs.readFileSync(oreprice);
const objdataoreprice = JSON.parse(rawdataoreprice);

const recipes = './data/recipes_api_dump.json';
const rawdatarecipes = fs.readFileSync(recipes);
//var objdatarecipes = JSON.parse(rawdatarecipes);

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
        //try {
        var objdatarecipes = JSON.parse(rawdatarecipes);
        var objdataschematics = JSON.parse(rawdataschematics);

        var { objRecipesTalented, objSchematicTalented } = await functions.loadTalent(profil, objdatarecipes, objdataschematics);

        console.log("ajout test");
        var list = [];
        await functions.recetteSearch(input, nombre, list, objRecipesTalented);
        //setTimeout(() => {
        // console.log("Retardée d'une seconde.");
        //console.log(list);
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
        //console.log(schematicsList);
        var txtElements = "";
        var txtSchematics = "";
        var txtTotal = "";
        var theTotal = "";
        var totalOrePrice = 0;
        var totalTalentPrice = 0;
        var oreList = [
            {
                Name: "Hematite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Bauxite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Coal",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Quartz",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Chromite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Natron",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Limestone",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Malachite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Pyrite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Petalite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Garnierite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Acanthite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Gold Nuggets",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Cobaltite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Cryolite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Kolbeckite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Rhodonite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Columbite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Illmenite",
                Quantity: 0,
                Price: 0
            },
            {
                Name: "Vanadinite",
                Quantity: 0,
                Price: 0
            }
        ];

        for (let index3 = 0; index3 < list.length; index3++) {
            txtElements += `- ${list[index3].item} : ${list[index3].itemQuantity}\n`;
            let ore = await functions.isOre(list[index3].item);
            //console.log(ore);


            if (ore) {
                var priceOre = objdataoreprice.find(re => re.Name === list[index3].item)
                var orePrice = list[index3].itemQuantity * priceOre.Price;
                let oreListIndex = oreList.findIndex(re => re.Name === list[index3].item);
                //console.log(oreListIndex);
                oreList[oreListIndex].Price = orePrice;
                oreList[oreListIndex].Quantity = list[index3].itemQuantity;
                totalOrePrice += orePrice;
                //console.table(oreList[oreListIndex]);
            }
            /*else {
                txtTotal += `- ${list[index3].item} : ${list[index3].itemQuantity}\n`;
            }*/
        }
            console.log(txtElements);

        theTotal += `Ore Price : ${totalOrePrice}h\n`;
        
        for (let index4 = 0; index4 < schematicsList.length; index4++) {
            var index5 = objSchematicTalented.map(object => object.Name).indexOf(schematicsList[index4].name);
            var talentPrice = (objSchematicTalented[index5].BatchPrice / objSchematicTalented[index5].BatchQuantity) * schematicsList[index4].nb;
            totalTalentPrice += talentPrice;
            txtSchematics += `- ${schematicsList[index4].name} : ${schematicsList[index4].nb} | ${talentPrice}h \n`;
        }
        console.table(oreList);
        for (let index6 = 0; index6 < oreList.length; index6++) {
            if (oreList[index6].Quantity != 0) {
                txtTotal += `- **${oreList[index6].Name}** : **${oreList[index6].Quantity}** | **${oreList[index6].Price}h**\n`;
            }else{
                txtTotal += `- ${oreList[index6].Name} : ${oreList[index6].Quantity} | ${oreList[index6].Price}h\n`;
            }
        }
        var rec = objdatarecipes.find(re => re.products[0].displayNameWithSize === input);
        var craftable = `${rec.nanocraftable}`;
        var crafts = ``;
        for (let index = 0; index < rec.ingredients.length; index++) {
            crafts += `- ${rec.ingredients[index].quantity * nombre} x ${rec.ingredients[index].displayNameWithSize}\n`
        }
        theTotal += `Schematic : ${Math.round(totalTalentPrice)}h\n`;
        var thebigTotal = totalTalentPrice + totalOrePrice;
        theTotal += `Total : **${Math.round(thebigTotal)}**h\n`;

        ServiceEmbed = new EmbedBuilder()
            .setColor("0xFFA500")
            .setTitle(`${nombre}x ${input} | Profil: ${profil}`)
            //.setAuthor({ name: 'Raitrax' })
            .setTimestamp()
            .addFields(
                { name: 'Crafts', value: crafts, inline: false },
                { name: 'Nanocraftable', value: craftable, inline: false },
                { name: 'Ore/Minerai nécessaire : ', value: txtTotal, inline: true },
                { name: 'Schematics : ', value: txtSchematics, inline: true },
                { name: 'Prix', value: theTotal, inline: false },

            )
            .setFooter({ text: 'Made by Raitrax' });

        return interaction.reply({ embeds: [ServiceEmbed] });
        //} catch (error) {
        //    interaction.reply({ content: `Essaie encore pour voir!`, ephemeral: true });
        //}



    },
};