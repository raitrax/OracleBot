const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Module } = require('module');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const items = './data/items_api_dump.json';
const recipes = './data/recipes_api_dump.json';
const logo = "../PBSC.png";
const fs = require('fs');
const rawdataitems = fs.readFileSync(items);
const objdataitems = JSON.parse(rawdataitems);
const rawdatarecipes = fs.readFileSync(recipes);
const objdatarecipes = JSON.parse(rawdatarecipes);

module.exports = {
    isOre: async function (oreName) {
        var ore = [
            "Hematite",
            "Bauxite",
            "Coal",
            "Quartz",
            "Oxygen",
            "Hydrogen",
            "Chromite",
            "Limestone",
            "Malachite",
            "Natron",
            "Acanthite",
            "Garnierite",
            "Petalite",
            "Pyrite",
            "Cobaltite",
            "Gold Nuggets",
            "Cryolite",
            "Kolbeckite",
            "Columbite",
            "Illmenite",
            "Rhodonite",
            "Vanadinite",
            "Thoramine"
        ]
        for (let index = 0; index < ore.length; index++) {
            if (oreName == ore[index]) {
                return true;
            }
        }
        return false;
    },
    getHeures: function () {
        var currentdate = new Date();
        var currentHours = currentdate.getHours();
        currentHours = ("0" + currentHours).slice(-2);
        var currentMinutes = currentdate.getMinutes();
        currentMinutes = ("0" + currentMinutes).slice(-2);
        var datetime = currentHours + "h" + currentMinutes;
        return datetime;
    },
    recetteSearch: async function (recette, nombre, list) {

        //console.log("for end items " + objdataitems.length);
        //console.log("for end recipes " + objdatarecipes.length);

        var itm = objdataitems.find(it => it.displayNameWithSize === recette);
        //var isOre = module.exports.isOre(itm.displayNameWithSize);
        //console.log(isOre);
        //console.log("itm : " + itm.displayNameWithSize);
        var schematicName = "Aucun Schematic";
        if (itm.schematics.length != 0) {
            console.log("schema : " + itm.schematics[0].displayNameWithSize);
            schematicName = itm.schematics[0].displayNameWithSize;
        }



        var rec = objdatarecipes.find(re => re.products[0].displayNameWithSize === recette);
        var nbsch;
        if (rec != null) {
            nbsch = nombre / rec.products[0].quantity;
            if (nbsch % 1 != 0) {
                console.log(nbsch);
                nbsch = Math.ceil(nbsch);
                console.log(nbsch);
                //nbpc = nbpc2 * rec.ingredients[index].quantity;
            }
        }
        else {
            nbsch = 0;
        }

        var index2 = list.map(object => object.item).indexOf(recette);

        if (index2 != -1) {
            list[index2].itemQuantity += nombre;
            list[index2].schematicsQuantity += nbsch;
        }
        else {
            list.push({
                item: recette,
                itemQuantity: nombre,
                schematics: schematicName,
                schematicsQuantity: nbsch
            });
        }
        if (rec != null) {
            //console.log("rec : " + rec.products[0].displayNameWithSize);


            for (let index = 0; index < rec.ingredients.length; index++) {
                //console.log(rec.ingredients[index].quantity + "/" + rec.ingredients[index].displayNameWithSize);
                var nbpc = Math.ceil((rec.ingredients[index].quantity / rec.products[0].quantity) * nombre);
                ///pour calculer les batchs necessaire pour les crafts afin d'avoir de quoi faire tourner les batch
                var nbpc2 = nbpc / rec.ingredients[index].quantity;
                if (nbpc2 % 1 != 0) {
                    //console.log(nbpc2);
                    nbpc2 = Math.ceil(nbpc2);
                    //console.log(nbpc2);
                    //nbpc = nbpc2 * rec.ingredients[index].quantity;
                }
                //console.log(`${rec.ingredients[index].displayNameWithSize} => ${nbpc} = ${rec.ingredients[index].quantity} / ${rec.products[0].quantity} * ${nombre} `)

                module.exports.recetteSearch(rec.ingredients[index].displayNameWithSize, nbpc, list)
            }
        }

        return list;
    }
}