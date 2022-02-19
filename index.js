const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const Sequelize = require('sequelize');
const { Console } = require('console');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const db = require('./database/database');
const Lspd = require('./models/Lspd');
const Formations = require('./models/Formations');

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

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

client.once('ready', () =>  {
	db.authenticate().then(() => {
        console.log("Logged in to DB.");
        Lspd.init(db);
		Lspd.sync();
		Formations.init(db);
		Formations.sync();
    }).catch(err => console.log(err));
	effectifLspd();
	//formationsLspd();
	console.log('Ready!');
	/*var obj = {
		table: []
	};
	obj.table.push({id: 1, square:2});
	var json = JSON.stringify(obj);
	fs.writeFile('data/agentsLSPD.json', json, 'utf8', function(err){
		if (err){
			console.log(err);
		}});*/

	console.log("test deb");
		fs.readFile('data/agentsLSPD.json', 'utf8', function readFileCallback(err, data){
			if (err){
				console.log(err);
			} else {
			obj = JSON.parse(data); //now it an object
			console.log(obj);
			obj.table.push({id: 2, square:3}); //add some data
			json = JSON.stringify(obj); //convert it back to json
			//fs.writeFile('data/agentsLSPD.json', json, 'utf8', function(err){
			//	if (err){
			//		console.log(err);
			//	}}); // write it back 
			console.log("test fin");
		}});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;
		
	
/*
	if (commandName === 'addLSPD') {
		const Matricule = interaction.options.getString('matricule');
		const Nom = interaction.options.getString('nom');
		const Number = interaction.options.getString('number');
		const Grade = interaction.options.getString('grade');
		
		//const Braquages = interaction.options.getString('braquages');
		//const Colonneswat = interaction.options.getString('colonneswat');
		//const Penitencier = interaction.options.getString('penitencier');
		//const Henry1 = interaction.options.getString('henry1');
		//const Henry2 = interaction.options.getString('henry2');
		//const Marie = interaction.options.getString('marie');
		//const Sierra = interaction.options.getString('sierra');
		//const Poursuite = interaction.options.getString('poursuite');
		//const Persecours = interaction.options.getString('persecours');
		
		try {
			// equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
			const Lspd = await LSPD.create({
				matricule: Matricule,
				nom: Nom,
				number: Number,
				grade: Grade
			});
			const Formations = await FORMATIONS.create({
				matricule: tagMatricule,
				braquages: Braquages.defaultValue,
				colonneswat: Colonneswat.defaultValue,
				penitencier: Penitencier.defaultValue,
				henry1: Henry1.defaultValue,
				henry2: Henry2.defaultValue,
				marie: Marie.defaultValue,
				sierra: Sierra.defaultValue,
				poursuite: Poursuite.defaultValue,
				persecours: Persecours.defaultValue,
			});

			return interaction.reply(`LSPD [${LSPD.matricule}] ${LSPD.nom} (${LSPD.number}) ajouté au grade de ${LSPD.grade}.`);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply("Cette personne fait déjà partie de l'effectif!");
			}

			return interaction.reply("Quelque chose c'est mal passé dans l'ajout du membre LSPD.");
		}
	} else if (commandName === 'matricule') {
		const numero = interaction.options.getString('numero');

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const membreLSPD = await LSPD.findOne({ where: { matricule: numero } });
		const formationLSPD = await Formations.findOne({ where: { matricule: numero } });

		if (membreLSPD) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			
			return interaction.reply(`LSPD [${membreLSPD.matricule}] ${membreLSPD.nom} (${membreLSPD.number}) ajouté au grade de ${membreLSPD.grade}.` + 
			`Formations : 
				- braquages : ${formationLSPD.braquages} 
				- colonneswat : ${formationLSPD.colonneswat} 
				- penitencier : ${formationLSPD.penitencier} 
				- henry1 : ${formationLSPD.henry1} 
				- henry2 : ${formationLSPD.henry2} 
				- marie : ${formationLSPD.marie} 
				- sierra : ${formationLSPD.sierra} 
				- poursuite : ${formationLSPD.poursuite} 
				- persecours : ${formationLSPD.persecours}
			`
			);
		}

		return interaction.reply(`Je n'ai pas trouvé le matricule : ${numero}`);
	} else if (commandName === 'editmatricule') {
		const Matricule = interaction.options.getString('matricule');
		const Nom = interaction.options.getString('nom');
		const Number = interaction.options.getString('number');
		const Grade = interaction.options.getString('grade');
		const Braquages = interaction.options.getString('braquages');


		// equivalent to: UPDATE tags (descrption) values (?) WHERE name = ?;
		const affectedRows = await LSPD.update({ nom: Nom, number : Number, grade : Grade }, { where: { matricule: Matricule } });

		if (affectedRows > 0) {
			return interaction.reply(`Tag ${tagName} was edited.`);
		}

		return interaction.reply(`Could not find a tag with name ${tagName}.`);
	} else if (commandName === 'taginfo') {
		const tagName = interaction.options.getString('name');

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: tagName } });

		if (tag) {
			return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
		}

		return interaction.reply(`Could not find tag: ${tagName}`);
	} else if (commandName === 'showtags') {
		const tagList = await Tags.findAll({ attributes: ['name'] });
		const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

		return interaction.reply(`List of tags: ${tagString}`);
	} else if (commandName === 'removelspd') {
		// equivalent to: DELETE from tags WHERE name = ?;
		const Matricule = interaction.options.getString('matricule');
		const rowCount = await LSPD.destroy({ where: { name: Matricule } });

		if (!rowCount) return interaction.reply("Ce matricule LSPD n'existe pas.");

		return interaction.reply('Membre LSPD/formation supprimé.');
	}
*/

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function effectifLspd()
{	

	const EffectifChannel = client.channels.cache.get('931249085678252123');
	EffectifChannel.bulkDelete(99, true).catch(error => {
		console.error(error);
		channel.send({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
	});
	//const tagList = Lspd.findAll({ attributes: ['matricule'] });
	//console.log(tagList);
}

function formationsLspd()
{	

	const channel = client.channels.cache.get('931252649993596938');
	channel.bulkDelete(99, true).catch(error => {
		console.error(error);
		channel.send({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
	});

	const users = Lspd.findAll();
	console.log("All users:", JSON.stringify(users, null, 2));

	const FormationLspdEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`lA.nom`)
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	;
	channel.send({ embeds: [FormationLspdEmbed] });
}

/*function edit()
{
	const guild = bot.guilds.get('guildIDhere');
	if (!guild) return console.log('Unable to find guild.');

	const channel = guild.channels.find(c => c.id === 'channelIDhere' && c.type === 'text');
	if (!channel) return console.log('Unable to find channel.');

	try {
		const message = await channel.fetchMessage('messageIDhere');
		if (!message) return console.log('Unable to find message.');

		await message.edit('Test.');
		console.log('Done.');
	} catch(err) {
		console.error(err);
	}
}*/

client.login(token);
