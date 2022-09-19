const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const { Console } = require('console');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const path = require('path');
const egals = "=========";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
	console.log("Commande : " + command.data.name)
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

client.once('ready', () =>  {

	console.log('Ready!');

});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;
		
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



client.login(token);
