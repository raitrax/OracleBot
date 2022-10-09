const { SlashCommandBuilder, AutocompleteInteraction } = require('discord.js');
const items = './data/items_api_dump.json';
const recipes = './data/recipes_api_dump.json';

const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('recette')
		.setDescription("recetteDU")
        .addStringOption(option => 
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
                .setAutocomplete(true)
            ),
 
	async execute(interaction) {
        const value = interaction.options.getString('input');
        console.log("ajout test");
        recetteSearch(value, 1);
        
        return interaction.reply({content:`test fait : ${value}`, ephemeral: true});				
        
        async function recetteSearch(recette, nombre){
            fs.readFile(items, 'utf8', function readFileCallback(err, dataitems){
                if (err){
                    console.log("erreur catch1 items " +err);
                } else {
                    fs.readFile(recipes, 'utf8', function readFileCallback(err2, datarecipes){
                        if (err2){
                            console.log("erreur catch1 recipes " +err2);
                        } else {
                            objdataitems = JSON.parse(dataitems); //now it's an object
                            objdatarecipes = JSON.parse(datarecipes); //now it's an object
                            //console.log("for end items " + objdataitems.length);
                            //console.log("for end recipes " + objdatarecipes.length);
                            
                            var itm = objdataitems.find(it => it.displayNameWithSize === recette);
                            console.log("itm : " + itm.displayNameWithSize);
                            if(itm.schematics.length != 0){
                                console.log("schema : " + itm.schematics[0].displayNameWithSize);
                            } 

                            var rec = objdatarecipes.find(re => re.products[0].displayNameWithSize === itm.displayNameWithSize);
                            if (rec != null){
                                console.log("rec : " + rec.products[0].displayNameWithSize);
                                for (let index = 0; index < rec.ingredients.length; index++) {
                                    console.log(rec.ingredients[index].quantity + "/" + rec.ingredients[index].displayNameWithSize);
                                    recetteSearch(rec.ingredients[index].displayNameWithSize, rec.ingredients[index].quantity)
                                }
                            }
                            
                            //console.log("");

                            /*for (let index = 0; index < objdataitems.length; index++) {
                                //if(objdatarecipes[index].displayNameWithSize != null){
                                if(objdataitems[index].displayNameWithSize == recette){
                                    //console.log(objdataitems[index].id + " " + objdataitems[index].displayNameWithSize);
                                    //console.log(objdataitems[index].schematics);
                                    
                                    for (let index1 = 0; index1 < objdataitems[index].schematics.length; index1++) {
                                        //console.log("schema : " + objdataitems[index].schematics[index1].displayNameWithSize);
                                    }
                                    for (let index2 = 0; index2 < objdatarecipes.length; index2++) {
                                        if(objdatarecipes[index2].products[0].displayNameWithSize == objdataitems[index].displayNameWithSize){
                                            //console.log("recette : " + objdatarecipes[index2].products[0].displayNameWithSize)
                                        }
                                        if(objdatarecipes[index2].products[0].id == objdataitems[index].id){
                                            //console.log(objdatarecipes[index2].ingredients.length);
                                            for (let index3 = 0; index3 < objdatarecipes[index2].ingredients.length; index3++) {
                                                //console.log(objdatarecipes[index2].ingredients[index3].quantity + "/" + objdatarecipes[index2].ingredients[index3].displayNameWithSize);
                                                recetteSearch(objdatarecipes[index2].ingredients[index3].displayNameWithSize, objdatarecipes[index2].ingredients[index3].quantity)
                                            }
                                            //console.log("");
                                        }
                                    }
                                }
                            }*/
                        }
                    });
                }
            });
        }
    },
};