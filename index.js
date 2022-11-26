const fs = require('fs');
const { Client, Collection, GatewayIntentBits, DiscordAPIError, InteractionType } = require('discord.js');
const { token } = require('./config.json');
const path = require('path');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const functions = require('./functions');
const deploy = require("./deploy-commands");
const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const items = './data/items_api_dump.json';


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
	console.log("Commande : " + command.data.name)
}

client.once('ready', async () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	//var list = [];
	//functions.recetteSearch("Adjustor l", 1, list);
	//await functions.loadTalent("lvl5");
	//await functions.searchHoney();


});

client.on('interactionCreate', async interaction => {
	if (interaction.isAutocomplete()) {
		if (interaction.commandName === 'recette') {
			const focusedOption = interaction.options.getFocused(true);
			if (focusedOption.name == "input") {
				var size = 25;

				var listItems = [];

				fs.readFile(items, 'utf8', async function readFileCallback(err, dataitems) {
					if (err) {
						console.log("erreur catch1 items" + err);
					} else {
						objdataitems = JSON.parse(dataitems); //now it's an object
						for (let index = 0; index < objdataitems.length; index++) {
							listItems[index] = objdataitems[index].displayNameWithSize;
						}
						const filtered = listItems.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()));
						var itemList = filtered.slice(0, size)

						await interaction.respond(
							itemList.map(choice => ({ name: choice, value: choice })),
						);
					}
				});
			}
			if (focusedOption.name == "profil") {
				const profils = [];
				const profilsPath = path.join(__dirname, 'data/profils');
				var profilsFiles = fs.readdirSync(profilsPath).filter(profil => profil.endsWith('.json'));
				for (let index = 0; index < profilsFiles.length; index++) {
					profilsFiles[index] = profilsFiles[index].substring(0, profilsFiles[index].length - 5);
				}

				//console.log(profilsFiles);


				//choices = ['lvl0', 'lvl5', 'Syth', 'Snow', 'Donny'];

				const filtered = profilsFiles.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()));
				await interaction.respond(
					filtered.map(choice => ({ name: choice, value: choice })),
				);
			}
		}
		if (interaction.commandName === 'profil') {
			const focusedValue = interaction.options.getFocused();
			const profils = [];
			const profilsPath = path.join(__dirname, 'data/profils');
			var profilsFiles = fs.readdirSync(profilsPath).filter(profil => profil.endsWith('.json'));
			for (let index = 0; index < profilsFiles.length; index++) {
				profilsFiles[index] = profilsFiles[index].substring(0, profilsFiles[index].length - 5);
			}

			//console.log(profilsFiles);


			//choices = ['lvl0', 'lvl5', 'Syth', 'Snow', 'Donny'];

			const filtered = profilsFiles.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));
			await interaction.respond(
				filtered.map(choice => ({ name: choice, value: choice })),
			);
		}
		if (interaction.commandName === 'modifprofil') {
			var size = 25;
			var listItems = [];
			const focusedOption = interaction.options.getFocused(true);
			if (focusedOption.name == "talent") {
				const talent = './data/profils/lvl0.json';
				const rawdatatalent = fs.readFileSync(talent);
				const objdatatalent = JSON.parse(rawdatatalent);
				for (let index = 0; index < objdatatalent.TalentList.length; index++) {
					listItems[index] = objdatatalent.TalentList[index].Name;
				}
				const filtered = listItems.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()));

				var itemList = filtered.slice(0, size)

				await interaction.respond(
					itemList.map(choice => ({ name: choice, value: choice })),
				);
			}
			if (focusedOption.name == "profil") {
				const profils = [];
				const profilsPath = path.join(__dirname, 'data/profils');
				var profilsFiles = fs.readdirSync(profilsPath).filter(profil => profil.endsWith('.json'));
				for (let index = 0; index < profilsFiles.length; index++) {
					profilsFiles[index] = profilsFiles[index].substring(0, profilsFiles[index].length - 5);
				}

				const filtered = profilsFiles.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()));
				await interaction.respond(
					filtered.map(choice => ({ name: choice, value: choice })),
				);
			}
		}
	}

	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		console.log(`commande exécuté : ${interaction.commandName} par : ${interaction.member.user}`);
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}



});

client.login(token);
