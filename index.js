const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
	console.log('Once Ready!');
});

client.on('ready', async () => {
	console.log('On Ready!');
    
    /*
    console.log(client.application.commands.cache)
    await client.application.commands.fetch();
    console.log(client.application.commands.cache)
    client.application.commands.cache.map(command => {
        command.delete();
    });
    
    console.log(client.guilds.cache.get("211506036362706945").commands.cache)
    await client.guilds.cache.get("211506036362706945").commands.fetch();
    console.log(client.guilds.cache.get("211506036362706945").commands.cache)
    client.guilds.cache.get("211506036362706945").commands.cache.map(command => {
      command.delete();
    });
    console.log(client.guilds.cache.get("211506036362706945").commands.cache)
    */

   //client.application.commands.create(command);
   //client.guilds.cache.get("211506036362706945").commands.create(command);
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