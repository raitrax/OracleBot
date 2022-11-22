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

client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	//var list = [];
	//functions.recetteSearch("Adjustor l", 1, list);
	functions.loadTalent();

});

client.on('interactionCreate', async interaction => {
	if (interaction.isAutocomplete()) {
		if (interaction.commandName === 'recette') {
			const focusedValue = interaction.options.getFocused().toLowerCase();
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
					const filtered = listItems.filter(choice => choice.toLowerCase().includes(focusedValue));
					var itemList = filtered.slice(0, size)

					await interaction.respond(
						itemList.map(choice => ({ name: choice, value: choice })),
					);
				}
			});



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
