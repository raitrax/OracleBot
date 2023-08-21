const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits, Partials, DiscordAPIError, InteractionType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { token, presentationID, DPSRoleID, TROLLRoleID, HEALRoleID, TANKRoleID, colorGreen } = require('./config.json');
const path = require('path');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const functions = require('./functions');
const deploy = require("./deploy-commands");
const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const db = require('./database/database');
const leagues = require('./models/leagues');
const allies = require('./models/allies');
const artefacts = require('./models/artefacts');
const prixsources = require('./models/prixsources');


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
	console.log("Commande : " + command.data.name)
}

client.once(Events.ClientReady, async () => {
	db.authenticate().then(() => {
		leagues.init(db);
		allies.init(db);
		artefacts.init(db);
		prixsources.init(db);
		leagues.sync();
		allies.sync();
		artefacts.sync();
		prixsources.sync();
		console.log("Logged in to DB.");

	}).catch(err => console.log(err));
	//await functions.service(client.channels.cache.get(presentationID));
});

client.on('messageCreate', async message => {
	/***
	if (message.channel.id === '1121178986333081660') {
		console.log(message);
		let hookFailyChannel = message.client.channels.cache.get('1121178986333081660');
		await hookFailyChannel.messages.fetch(message.id).then(async msg => {
			console.log(msg.embeds);

			console.log(msg.embeds[0]);
			if (msg.embeds[0].title == "Détails Tâches") {
				let fields = msg.embeds[0].fields;
				fields.forEach(async (field) => {
					console.log(field.name);
					console.log(field.value);
					// Récupérez le nombre de tâches à faire.
					const number = field.value.match(/\d+/);
					console.log(number);
				})
			}
		});

	}
	*/
});

/***client.on('guildMemberAdd', async memberAdd => {
	const logchannel = memberAdd.guild.channels.cache.get(log_channel_id);
	console.log(`ajout de ${memberAdd} sur le serveur`);
	memberAdd.roles.add(autoRoleId).then(console.log(`ajout du role membre pour ${memberAdd}`));
	await logchannel.send({ content: `ajout de ${memberAdd} sur le serveur`, ephemeral: false });
});

client.on('guildMemberRemove', async memberRemove => {
	const logchannel = memberAdd.guild.channels.cache.get(log_channel_id);
	console.log(`ajout de ${memberAdd} sur le serveur`);
	await logchannel.send({ content: `Retrait de ${memberRemove} sur le serveur`, ephemeral: false });
});***/

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isButton()) {
		let member = interaction.member;
		console.log(`Bouton exécuté : ${interaction.customId} par : ${member.user}`);
		await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));

		switch (interaction.customId) {
			case "DPS":
				if (member.roles.cache.has(DPSRoleID)) {
					await member.roles.remove(DPSRoleID);
					let RetraitEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Retrait du rôle **DPS**`)

					await interaction.editReply({ embeds: [RetraitEmbed], ephemeral: true });
				} else {
					await member.roles.add(DPSRoleID);
					let AjoutEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Ajout du rôle **DPS**`)

					await interaction.editReply({ embeds: [AjoutEmbed], ephemeral: true });
				}
				break;
			case "TROLL":
				if (member.roles.cache.has(TROLLRoleID)) {
					await member.roles.remove(TROLLRoleID);
					let RetraitEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Retrait du rôle **TROLL**`)

					await interaction.editReply({ embeds: [RetraitEmbed], ephemeral: true });
				} else {
					await member.roles.add(TROLLRoleID);
					let AjoutEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Ajout du rôle **TROLL**`)

					await interaction.editReply({ embeds: [AjoutEmbed], ephemeral: true });
				}
				break;
			case "HEAL":
				if (member.roles.cache.has(HEALRoleID)) {
					await member.roles.remove(HEALRoleID);
					let RetraitEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Retrait du rôle **HEAL**`)

					await interaction.editReply({ embeds: [RetraitEmbed], ephemeral: true });
				} else {
					await member.roles.add(HEALRoleID);
					let AjoutEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Ajout du rôle **HEAL**`)

					await interaction.editReply({ embeds: [AjoutEmbed], ephemeral: true });
				}
				break;
			case "TANK":
				if (member.roles.cache.has(TANKRoleID)) {
					await member.roles.remove(TANKRoleID);
					let RetraitEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Retrait du rôle **TANK**`)

					await interaction.editReply({ embeds: [RetraitEmbed], ephemeral: true });
				} else {
					await member.roles.add(TANKRoleID);
					let AjoutEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Ajout du rôle **TANK**`)

					await interaction.editReply({ embeds: [AjoutEmbed], ephemeral: true });
				}
				break;
			default:
				await interaction.reply({ content: `Vous n'avez pas d'actions assigner à ce bouton`, ephemeral: true });

				break;
		}

	}
	if (interaction.isAutocomplete()) {
		if (interaction.commandName === 'supligue') {
			const focusedValue = interaction.options.getFocused();
			let Checkleagues = await leagues.findAll();
			let listItems = [];
			for (let index = 0; index < Checkleagues.length; index++) {
				listItems[index] = Checkleagues[index].name;
			}
			const filtered = listItems.filter(choice => choice.includes(focusedValue));
			await interaction.respond(
				filtered.map(choice => ({ name: choice, value: choice })),
			);
		}
	}
	if (interaction.isStringSelectMenu()) {
		let member = interaction.member;
		await interaction.deferReply({ ephemeral: true }).catch((e) => console.log(e));
		switch (interaction.customId) {
			case "selectLeague":
				let leagueChoose = "";
				interaction.values.forEach(async (value) => {
					leagueChoose += `${value}`;
				})
				if (member.roles.cache.has(leagueChoose)) {
					await member.roles.remove(leagueChoose);
					let RetraitEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Retrait du rôle <@&${leagueChoose}>`)

					await interaction.editReply({ embeds: [RetraitEmbed], ephemeral: true });
				} else {
					await member.roles.add(leagueChoose);
					let AjoutEmbed = new EmbedBuilder()
						.setColor(colorGreen)
						.setAuthor({ name: `Oracle` })
						.setDescription(`Ajout du rôle <@&${leagueChoose}>`)

					await interaction.editReply({ embeds: [AjoutEmbed], ephemeral: true });
				}
				await interaction.editReply({ content: `Vous vous êtes attribué le rôle de la ligue : <@&${leagueChoose}>`, ephemeral: true });

				break;
			case "selection":
				break;
			default:
				await interaction.editReply({ content: `Vous n'avez pas d'actions assigner à ce menu de selection`, ephemeral: true });
				break;
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

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (reaction.message.partial) {
		try {
			await reaction.message.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
		}
	}

	if (reaction.message.channel.id == "1085600714014851122" && user.id != "476393602168389633") {
		console.log(`${user.username} reacted with "${reaction.emoji}" in ${reaction.message.channel.id}.`);
		await reaction.message.reactions.removeAll().catch(error => console.error('Failed to clear reactions:', error));
		await reaction.react(reaction.emoji.id);
	}

});
client.login(token);
