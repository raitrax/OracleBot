const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Module } = require('module');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const logo = "../PBSC.png";
const fs = require('fs');

const items = './data/items_api_dump.json';
const rawdataitems = fs.readFileSync(items);
const objdataitems = JSON.parse(rawdataitems);

const recipes = './data/recipes_api_dump.json';
const rawdatarecipes = fs.readFileSync(recipes);
var objdatarecipes = JSON.parse(rawdatarecipes);



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
    recetteSearch: async function (recette, nombre, list, objRecipesTalented) {

        //console.log("for end items " + objdataitems.length);
        //console.log("for end recipes " + objdatarecipes.length);

        var itm = objdataitems.find(it => it.displayNameWithSize === recette);
        //var isOre = module.exports.isOre(itm.displayNameWithSize);
        //console.log(isOre);
        //console.log("itm : " + itm.displayNameWithSize);
        var schematicName = "Aucun Schematic";
        if (itm.schematics.length != 0) {
            //console.log("schema : " + itm.schematics[0].displayNameWithSize);
            schematicName = itm.schematics[0].displayNameWithSize;
        }

        var rec = objRecipesTalented.find(re => re.products[0].displayNameWithSize === recette);
        var nbsch;
        if (rec != null) {
            nbsch = nombre / rec.products[0].quantity;
            if (nbsch % 1 != 0) {
                //console.log(nbsch);
                nbsch = Math.ceil(nbsch);
                //console.log(nbsch);
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

                module.exports.recetteSearch(rec.ingredients[index].displayNameWithSize, nbpc, list, objRecipesTalented)
            }
        }

        return list;
    },
    loadTalent: async function (profil, objdatarecipes) {
        const talents = `./data/profils/${profil}.json`;

        var rawdatatalents;
        try {
            rawdatatalents = fs.readFileSync(`./data/profils/${profil}.json`);
        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            const lvl0 = `./data/profils/lvl0.json`;
            rawdatatalents = fs.readFileSync(lvl0);

        }
        const objdatatalents = JSON.parse(rawdatatalents);

        for (let index = 0; index < objdatatalents.TalentList.length; index++) {
            //console.log(objdatatalents.TalentList[index].AffectedRecipe)
            for (let index2 = 0; index2 < objdatatalents.TalentList[index].AffectedRecipe.length; index2++) {
                //console.log(objdatatalents.TalentList[index].AffectedRecipe[index2])
                var rec = objdatarecipes.find(re => re.products[0].displayNameWithSize === objdatatalents.TalentList[index].AffectedRecipe[index2]);
                var recIndex = objdatarecipes.findIndex(re => re.products[0].displayNameWithSize === objdatatalents.TalentList[index].AffectedRecipe[index2]);
                //console.log(rec.products[0].displayNameWithSize)

                switch (objdatatalents.TalentList[index].categorie) {
                    case "Ore Refining":
                    case "Product Refining":
                    case "Fuel Refining":
                    case "Scrap Refinery":
                    case "Honeycomb Refining":
                        for (let index3 = 0; index3 < objdatarecipes[recIndex].ingredients.length; index3++) {
                            //console.log("avant : " + rec.ingredients[index3].displayNameWithSize + " " + rec.ingredients[index3].quantity);
                            rec.ingredients[index3].quantity = rec.ingredients[index3].quantity - (rec.ingredients[index3].quantity * (objdatatalents.TalentList[index].lvl * objdatatalents.TalentList[index].amount))
                            //console.log("après : " + rec.ingredients[index3].displayNameWithSize + " " + rec.ingredients[index3].quantity);
                        }
                        break;
                    case "Pure Productivity":
                    case "Product Productivity":
                    case "Fuel Productivity":
                    case "Honeycomb Productivity":
                        for (let index3 = 0; index3 < objdatarecipes[recIndex].products.length; index3++) {
                            //console.log("avant : " + rec.products[index3].displayNameWithSize + " " + rec.products[index3].quantity);
                            rec.products[index3].quantity = rec.products[index3].quantity + (rec.products[index3].quantity * (objdatatalents.TalentList[index].lvl * objdatatalents.TalentList[index].amount))
                            //console.log("après : " + rec.products[index3].displayNameWithSize + " " + rec.products[index3].quantity);
                        }
                        break;
                    case "Intermediary Part":
                    case "Ammo Productivity":
                    case "Scrap Productivity":
                        for (let index3 = 0; index3 < objdatarecipes[recIndex].products.length; index3++) {
                            //console.log("avant : " + rec.products[index3].displayNameWithSize + " " + rec.products[index3].quantity);
                            rec.products[index3].quantity = rec.products[index3].quantity + (objdatatalents.TalentList[index].lvl * objdatatalents.TalentList[index].amount)
                            //console.log("après : " + rec.products[index3].displayNameWithSize + " " + rec.products[index3].quantity);
                        }
                        break;
                    default:
                        console.log("pas ok");
                        break;
                }
            }

        }
        return objdatarecipes;

    },

    searchHoney: async function () { //temporaire pour chercher tous les items d'honeycomb existant pour les ajouter au talents
        var listItems1PureIron = [];
        var listItems1PureCarbon = [];
        var listItems1PureAluminium = [];
        var listItems1PureSilicon = [];
        var listItems1Product = [];
        var listItems2Pure = [];
        var listItems2Product = [];
        var listItems3Pure = [];
        var listItems3Product = [];
        var listItems4Pure = [];
        var listItems4Product = [];
        var listItems5Pure = [];
        var listItems5Product = [];
        const rawdataitems = fs.readFileSync(items);
        const objdataitems = JSON.parse(rawdataitems);
        var T1PureIron = objdataitems.filter(re => re.displayNameWithSize.includes("Iron"));
        var T1PureCarbon = objdataitems.filter(re => re.displayNameWithSize.includes("Carbon"));
        var T1PureAluminium = objdataitems.filter(re => re.displayNameWithSize.includes("Aluminium"));
        var T1PureSilicon = objdataitems.filter(re => re.displayNameWithSize.includes("Silicon"));
        var T1Product = objdataitems.find(re => re.displayNameWithSize === "Tier 1 Product Honeycomb Schematic Copy");
        var T2Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 2 Pure Honeycomb Schematic Copy");
        var T2Product = objdataitems.find(re => re.displayNameWithSize === "Tier 2 Product Honeycomb Schematic Copy");
        var T3Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 3 Pure Honeycomb Schematic Copy");
        var T3Product = objdataitems.find(re => re.displayNameWithSize === "Tier 3 Product Honeycomb Schematic Copy");
        var T4Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 4 Pure Honeycomb Schematic Copy");
        var T4Product = objdataitems.find(re => re.displayNameWithSize === "Tier 4 Product Honeycomb Schematic Copy");
        var T5Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 5 Pure Honeycomb Schematic Copy");
        var T5Product = objdataitems.find(re => re.displayNameWithSize === "Tier 5 Product Honeycomb Schematic Copy");

        for (let index = 0; index < T1PureIron.length; index++) {
            listItems1PureIron[index] = T1PureIron[index].displayNameWithSize;
        }
        for (let index = 0; index < T1PureCarbon.length; index++) {
            listItems1PureCarbon[index] = T1PureCarbon[index].displayNameWithSize;
        }
        for (let index = 0; index < T1PureAluminium.length; index++) {
            listItems1PureAluminium[index] = T1PureAluminium[index].displayNameWithSize;
        }
        for (let index = 0; index < T1PureSilicon.length; index++) {
            listItems1PureSilicon[index] = T1PureSilicon[index].displayNameWithSize;
        }

        for (let index = 0; index < T1Product.products.length; index++) {
            listItems1Product[index] = T1Product.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T2Pure.products.length; index++) {
            listItems2Pure[index] = T2Pure.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T2Product.products.length; index++) {
            listItems2Product[index] = T2Product.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T3Pure.products.length; index++) {
            listItems3Pure[index] = T3Pure.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T3Product.products.length; index++) {
            listItems3Product[index] = T3Product.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T4Pure.products.length; index++) {
            listItems4Pure[index] = T4Pure.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T4Product.products.length; index++) {
            listItems4Product[index] = T4Product.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T5Pure.products.length; index++) {
            listItems5Pure[index] = T5Pure.products[index].displayNameWithSize;
        }
        for (let index = 0; index < T5Product.products.length; index++) {
            listItems5Product[index] = T5Product.products[index].displayNameWithSize;
        }


        fs.writeFileSync(`./data/T1PureIron.json`, JSON.stringify(listItems1PureIron));
        fs.writeFileSync(`./data/T1PureCarbon.json`, JSON.stringify(listItems1PureCarbon));
        fs.writeFileSync(`./data/T1PureAluminium.json`, JSON.stringify(listItems1PureAluminium));
        fs.writeFileSync(`./data/T1PureSilicon.json`, JSON.stringify(listItems1PureSilicon));
        fs.writeFileSync(`./data/T1Product.json`, JSON.stringify(listItems1Product));
        fs.writeFileSync(`./data/T2Pure.json`, JSON.stringify(listItems2Pure));
        fs.writeFileSync(`./data/T2Product.json`, JSON.stringify(listItems2Product));
        fs.writeFileSync(`./data/T3Pure.json`, JSON.stringify(listItems3Pure));
        fs.writeFileSync(`./data/T3Product.json`, JSON.stringify(listItems3Product));
        fs.writeFileSync(`./data/T4Pure.json`, JSON.stringify(listItems4Pure));
        fs.writeFileSync(`./data/T4Product.json`, JSON.stringify(listItems4Product));
        fs.writeFileSync(`./data/T5Pure.json`, JSON.stringify(listItems5Pure));
        fs.writeFileSync(`./data/T5Product.json`, JSON.stringify(listItems5Product));
    }
}