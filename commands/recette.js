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
        let objdatarecipes = JSON.parse(rawdatarecipes);
        let objdataschematics = JSON.parse(rawdataschematics);

        let { objRecipesTalented, objSchematicTalented } = await functions.loadTalent(profil, objdatarecipes, objdataschematics);

        console.log("ajout test");
        let list = [];
        await functions.recetteSearch(input, nombre, list, objRecipesTalented);
        let index2;
        let schematicsList = [];
        for (const li of list) {
            index2 = schematicsList.map(object => object.name).indexOf(li.schematics);

            if (index2 != -1) {
                schematicsList[index2].nb += li.schematicsQuantity;
            } else {
                schematicsList.push({ name: li.schematics, nb: li.schematicsQuantity });
            }

        }
        let txtElements = "";
        let txtSchematics = "";
        let txtTotal = "";
        let theTotal = "";
        let totalOrePrice = 0;
        let totalTalentPrice = 0;
        let oreList = [
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

        for (const li of list) {
            txtElements += `- ${li.item} : ${li.itemQuantity}\n`;
            let ore = await functions.isOre(li.item);

            if (ore) {
                let priceOre = objdataoreprice.find(re => re.Name === li.item)
                let orePrice = li.itemQuantity * priceOre.Price;
                let oreListIndex = oreList.findIndex(re => re.Name === li.item);
                oreList[oreListIndex].Price = orePrice;
                oreList[oreListIndex].Quantity = li.itemQuantity;
                totalOrePrice += orePrice;
            }
            /*else {
                txtTotal += `- ${list[index3].item} : ${list[index3].itemQuantity}\n`;
            }*/
        }
        theTotal += `Ore Price : ${totalOrePrice}h\n`;
        
        for (const schematicsLi of schematicsList) {
            let index5 = objSchematicTalented.map(object => object.Name).indexOf(schematicsLi.name);
            let talentPrice = (objSchematicTalented[index5].BatchPrice / objSchematicTalented[index5].BatchQuantity) * schematicsLi.nb;
            totalTalentPrice += talentPrice;
            txtSchematics += `- ${schematicsLi.name} : ${schematicsLi.nb} | ${talentPrice}h \n`;
        }
        for (const oreLi of oreList) {
            if (oreLi.Quantity != 0) {
                txtTotal += `- **${oreLi.Name}** : **${oreLi.Quantity}** | **${oreLi.Price}h**\n`;
            }else{
                txtTotal += `- ${oreLi.Name} : ${oreLi.Quantity} | ${oreLi.Price}h\n`;
            }
        }
        let rec = objdatarecipes.find(re => re.products[0].displayNameWithSize === input);
        let craftable = `${rec.nanocraftable}`;
        let crafts = ``;
        for (const recingre of rec.ingredients) {
            crafts += `- ${recingre.quantity * nombre} x ${recingre.displayNameWithSize}\n`
        }
        theTotal += `Schematic : ${Math.round(totalTalentPrice)}h\n`;
        let thebigTotal = totalTalentPrice + totalOrePrice;
        theTotal += `Total : **${Math.round(thebigTotal)}**h\n`;

        let ServiceEmbed = new EmbedBuilder()
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