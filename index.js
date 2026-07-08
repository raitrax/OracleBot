require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { config, isId } = require('./lib/config');
const { handleButton } = require('./lib/buttons');

// Validation des variables d'environnement
if (!process.env.TOKEN) {
	console.error('❌ Erreur : TOKEN manquant dans le fichier .env');
	process.exit(1);
}

if (!process.env.CLIENT_ID) {
	console.error('❌ Erreur : CLIENT_ID manquant dans le fichier .env');
	process.exit(1);
}

if (!process.env.GUILD_ID) {
	console.error('❌ Erreur : GUILD_ID manquant dans le fichier .env');
	process.exit(1);
}

// Le message de bienvenue nécessite l'intent privilégié « Server Members ».
// On ne le demande QUE si un salon de bienvenue est configuré : sinon le bot
// planterait au login tant que l'intent n'est pas activé dans le Developer Portal.
const intents = [GatewayIntentBits.Guilds];
const welcomeEnabled = config.welcome && isId(config.welcome.channelId);
if (welcomeEnabled) {
	intents.push(GatewayIntentBits.GuildMembers);
}

const client = new Client({ intents });
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

// Message de bienvenue + auto-rôle à l'arrivée d'un membre
if (welcomeEnabled) {
	client.on(Events.GuildMemberAdd, async (member) => {
		const w = config.welcome;
		try {
			const channel = member.guild.channels.cache.get(w.channelId);
			if (channel) {
				const text = (w.message || 'Bienvenue {user} !')
					.replaceAll('{user}', `<@${member.id}>`)
					.replaceAll('{server}', member.guild.name)
					.replaceAll('{count}', String(member.guild.memberCount));
				await channel.send(text);
			}
			if (isId(w.autoRoleId)) {
				await member.roles.add(w.autoRoleId);
			}
		} catch (error) {
			console.error('Bienvenue/auto-rôle échoué :', error.message);
		}
	});
	console.log('👋 Message de bienvenue activé');
}

client.on(Events.InteractionCreate, async interaction => {
	// Boutons (auto-rôles, tickets)
	if (interaction.isButton()) {
		try {
			await handleButton(interaction);
		} catch (error) {
			console.error(error);
			if (!interaction.replied && !interaction.deferred) {
				interaction.reply({ content: 'Une erreur est survenue.', flags: MessageFlags.Ephemeral }).catch(() => {});
			}
		}
		return;
	}

	// Commandes slash
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		console.log(`⚡ Commande exécutée : /${interaction.commandName} par ${interaction.user.tag}`);
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		const errorMessage = { content: 'Une erreur est survenue lors de l\'exécution de cette commande !', flags: MessageFlags.Ephemeral };
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
