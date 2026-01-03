require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Validation des variables d'environnement
if (!process.env.TOKEN) {
	console.error('❌ Erreur : TOKEN manquant dans le fichier .env');
	process.exit(1);
}

if (!process.env.CLIENT_ID) {
	console.error('❌ Erreur : CLIENT_ID manquant dans le fichier .env');
	process.exit(1);
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});
const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
	console.log("Commande : " + command.data.name)
}

client.once(Events.ClientReady, async () => {
	console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
	console.log(`📊 ${client.guilds.cache.size} serveur(s) | ${client.commands.size} commande(s)`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		console.log(`⚡ Commande exécutée : /${interaction.commandName} par ${interaction.user.tag}`);
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		const errorMessage = { content: 'Une erreur est survenue lors de l\'exécution de cette commande !', ephemeral: true };
		if (interaction.deferred || interaction.replied) {
			return interaction.followUp(errorMessage);
		} else {
			return interaction.reply(errorMessage);
		}
	}
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
	console.error('❌ Erreur non gérée :', error);
});

process.on('uncaughtException', (error) => {
	console.error('❌ Exception non capturée :', error);
	process.exit(1);
});

client.login(process.env.TOKEN);
