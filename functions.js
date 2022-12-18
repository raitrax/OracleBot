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
let objdatarecipes = JSON.parse(rawdatarecipes);

const schematics = './data/schematic.json';
const rawdataschematics = fs.readFileSync(schematics);
let objdataschematics = JSON.parse(rawdataschematics);

module.exports = {
    isOre: async function (oreName) {
        let ore = [
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
        for (const or of ore) {
            if (oreName == or) {
                return true;
            }
        }
        return false;
    },
    getHeures: function () {
        let currentdate = new Date();
        let currentHours = currentdate.getHours();
        currentHours = ("0" + currentHours).slice(-2);
        let currentMinutes = currentdate.getMinutes();
        currentMinutes = ("0" + currentMinutes).slice(-2);
        let datetime = currentHours + "h" + currentMinutes;
        return datetime;
    },
    recetteSearch: async function (recette, nombre, list, objRecipesTalented) {

        let itm = objdataitems.find(it => it.displayNameWithSize === recette);
        if (!itm.displayNameWithSize.toLowerCase().includes("catalyst")) {

            let schematicName = "Aucun Schematic";
            if (itm.schematics.length != 0) {
                schematicName = itm.schematics[0].displayNameWithSize;
            }

            let rec = objRecipesTalented.find(re => re.products[0].displayNameWithSize === recette);
            let nbsch;
            if (rec != null) {
                nbsch = nombre / rec.products[0].quantity;
                if (nbsch % 1 != 0) {
                    nbsch = Math.ceil(nbsch);
                    ///nbpc = nbpc2 * rec.ingredients[index].quantity;
                }
            }
            else {
                nbsch = 0;
            }

            let index2 = list.map(object => object.item).indexOf(recette);

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
                for (const recingre of rec.ingredients) {
                    let nbpc = Math.ceil((recingre.quantity / rec.products[0].quantity) * nombre);
                    ///pour calculer les batchs necessaire pour les crafts afin d'avoir de quoi faire tourner les batch
                    //var nbpc2 = nbpc / rec.ingredients[index].quantity;
                    //console.log(nbpc2);
                    //nbpc2 = Math.ceil(nbpc2);
                    //console.log(nbpc2);
                    //nbpc = nbpc2 * rec.ingredients[index].quantity;
                    //console.log(`${rec.ingredients[index].displayNameWithSize} => ${nbpc} = ${rec.ingredients[index].quantity} / ${rec.products[0].quantity} * ${nombre} `)

                    module.exports.recetteSearch(recingre.displayNameWithSize, nbpc, list, objRecipesTalented)
                }
            }
        }

        return list;
    },
    loadTalent: async function (profil, objdatarecipes, objdataschematics) {
        let rawdatatalents;
        try {
            rawdatatalents = fs.readFileSync(`./data/profils/${profil}.json`);
        } catch (err) {
            // Here you get the error when the file was not found,
            // but you also get any other error
            const lvl0 = `./data/profils/lvl0.json`;
            rawdatatalents = fs.readFileSync(lvl0);

        }
        const objdatatalents = JSON.parse(rawdatatalents);

        for (const talentList of objdatatalents.TalentList) {
            //console.log(objdatatalents.TalentList[index].AffectedRecipe)
            for (const affectedRecipe of talentList.AffectedRecipe) {
                //console.log(objdatatalents.TalentList[index].AffectedRecipe[index2])
                let rec = objdatarecipes.find(re => re.products[0].displayNameWithSize === affectedRecipe);
                let recIndex = objdatarecipes.findIndex(re => re.products[0].displayNameWithSize === affectedRecipe);
                //console.log(rec.products[0].displayNameWithSize)

                switch (talentList.categorie) {
                    case "Ore Refining":
                    case "Product Refining":
                    case "Fuel Refining":
                    case "Scrap Refinery":
                    case "Honeycomb Refining":
                        for (let index3 = 0; index3 < objdatarecipes[recIndex].ingredients.length; index3++) {
                            rec.ingredients[index3].quantity = rec.ingredients[index3].quantity - (rec.ingredients[index3].quantity * (talentList.lvl * talentList.amount));
                        }
                        break;
                    case "Pure Productivity":
                    case "Product Productivity":
                    case "Fuel Productivity":
                    case "Honeycomb Productivity":
                        for (let index3 = 0; index3 < objdatarecipes[recIndex].products.length; index3++) {
                            rec.products[index3].quantity = rec.products[index3].quantity + (rec.products[index3].quantity * (talentList.lvl * talentList.amount));
                        }
                        break;
                    case "Intermediary Part":
                    case "Ammo Productivity":
                    case "Scrap Productivity":
                        for (let index3 = 0; index3 < objdatarecipes[recIndex].products.length; index3++) {
                            rec.products[index3].quantity = rec.products[index3].quantity + (talentList.lvl * talentList.amount);
                        }
                        break;
                    case "Schematics Cost":
                    case "Schematics Productivity":
                        console.log("passé");
                        break;
                    default:
                        console.log("pas ok");
                        break;
                }
            }
        }

        let schemaCostIndex = objdatatalents.TalentList.findIndex(re => re.Name === "Schematic Cost Optimization");
        let schemaAdvCostIndex = objdatatalents.TalentList.findIndex(re => re.Name === "Advanced Schematic Cost Optimization");
        let schemaProdIndex = objdatatalents.TalentList.findIndex(re => re.Name === "Schematic Output Productivity");
        let schemaAdvProdIndex = objdatatalents.TalentList.findIndex(re => re.Name === "Advanced Schematic Output Productivity");

        for (const schematics of objdataschematics) {
            schematics.UnitPrice = Math.round(schematics.UnitPrice - (schematics.UnitPrice * ((objdatatalents.TalentList[schemaCostIndex].lvl * objdatatalents.TalentList[schemaCostIndex].amount) + (objdatatalents.TalentList[schemaAdvCostIndex].lvl * objdatatalents.TalentList[schemaAdvCostIndex].amount))));
            schematics.BatchPrice = Math.round(schematics.BatchPrice - (schematics.BatchPrice * ((objdatatalents.TalentList[schemaCostIndex].lvl * objdatatalents.TalentList[schemaCostIndex].amount) + (objdatatalents.TalentList[schemaAdvCostIndex].lvl * objdatatalents.TalentList[schemaAdvCostIndex].amount))));
            schematics.BatchQuantity = Math.round(schematics.BatchQuantity + (schematics.BatchQuantity * ((objdatatalents.TalentList[schemaProdIndex].lvl * objdatatalents.TalentList[schemaProdIndex].amount) + (objdatatalents.TalentList[schemaAdvProdIndex].lvl * objdatatalents.TalentList[schemaAdvProdIndex].amount))));
        }
        let objRecipesTalented = objdatarecipes;
        let objSchematicTalented = objdataschematics;
        return { objRecipesTalented, objSchematicTalented };

    },

    searchHoney: async function () { //temporaire pour chercher tous les items d'honeycomb existant pour les ajouter au talents
        let listItems1PureIron = [];
        let listItems1PureCarbon = [];
        let listItems1PureAluminium = [];
        let listItems1PureSilicon = [];
        let listItems1Product = [];
        let listItems2Pure = [];
        let listItems2Product = [];
        let listItems3Pure = [];
        let listItems3Product = [];
        let listItems4Pure = [];
        let listItems4Product = [];
        let listItems5Pure = [];
        let listItems5Product = [];
        const rawdataitems = fs.readFileSync(items);
        const objdataitems = JSON.parse(rawdataitems);
        let T1PureIron = objdataitems.filter(re => re.displayNameWithSize.includes("Iron"));
        let T1PureCarbon = objdataitems.filter(re => re.displayNameWithSize.includes("Carbon"));
        let T1PureAluminium = objdataitems.filter(re => re.displayNameWithSize.includes("Aluminium"));
        let T1PureSilicon = objdataitems.filter(re => re.displayNameWithSize.includes("Silicon"));
        let T1Product = objdataitems.find(re => re.displayNameWithSize === "Tier 1 Product Honeycomb Schematic Copy");
        let T2Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 2 Pure Honeycomb Schematic Copy");
        let T2Product = objdataitems.find(re => re.displayNameWithSize === "Tier 2 Product Honeycomb Schematic Copy");
        let T3Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 3 Pure Honeycomb Schematic Copy");
        let T3Product = objdataitems.find(re => re.displayNameWithSize === "Tier 3 Product Honeycomb Schematic Copy");
        let T4Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 4 Pure Honeycomb Schematic Copy");
        let T4Product = objdataitems.find(re => re.displayNameWithSize === "Tier 4 Product Honeycomb Schematic Copy");
        let T5Pure = objdataitems.find(re => re.displayNameWithSize === "Tier 5 Pure Honeycomb Schematic Copy");
        let T5Product = objdataitems.find(re => re.displayNameWithSize === "Tier 5 Product Honeycomb Schematic Copy");

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