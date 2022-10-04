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
        fs.readFile(items, 'utf8', function readFileCallback(err, dataitems){
            if (err){
                console.log("erreur catch1 items" +err);
            } else {
                fs.readFile(recipes, 'utf8', function readFileCallback(err, datarecipes){
                    if (err){
                        console.log("erreur catch1 recipes" +err);
                    } else {
                        objdataitems = JSON.parse(dataitems); //now it's an object
                        objdatarecipes = JSON.parse(datarecipes); //now it's an object
                        //console.log(objdataitems);
                        //console.log(objdatarecipes);
                        for (let index = 0; index < objdataitems.length; index++) {
                            //if(objdatarecipes[index].displayNameWithSize != null){
                            if(objdataitems[index].displayNameWithSize == value){
                                console.log(objdataitems[index].id);

                                //console.log(objdataitems[index].schematics);
                                for (let index1 = 0; index1 < objdataitems[index].schematics.length; index1++) {
                                    console.log("schema : " + objdataitems[index].schematics[index1].locDisplayNameWithSize);
                                }
                                for (let index2 = 0; index2 < objdatarecipes.length; index2++) {
                                    if(objdatarecipes[index2].products[0].id == objdataitems[index].id){
                                        console.log(objdatarecipes[index2].id);
                                        console.log(objdatarecipes[index2].tier);
                                        //console.log(objdatarecipes[index2].ingredients.length);
                                        for (let index3 = 0; index3 < objdatarecipes[index2].ingredients.length; index3++) {
                                            console.log(objdatarecipes[index2].ingredients[index3].quantity + "/" + objdatarecipes[index2].ingredients[index3].displayNameWithSize);
                                        }
                                    }
                                }
                            }
                        };
                        //console.log("for end items " + objdataitems.length);
                        //console.log("for end recipes " + objdatarecipes.length);
                    }
                });
            }
        });
        return interaction.reply({content:`test fait : ${value}`, ephemeral: true});				
    },
};