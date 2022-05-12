const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const { Console } = require('console');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const path = require('path');
const agent = ('./data/agentsLSPD.json');
var effectifTXT = "```\n";
var effectifTXT1 = "```\n";
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
	effectifLspd();
	formationsLspd();
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

async function effectifLspd()
{	
	const EffectifChannel = client.channels.cache.get('971551444853461023');
	EffectifChannel.bulkDelete(99, true).catch(error => {
		console.error(error);
		channel.send({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
	});
	fs.readFile(agent, 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log("erreur catch1 " + err);
		} else {
			obj = JSON.parse(data); //now it's an object
			var com = obj.table.filter(function (agent){ return agent.grade == "Commissaire"});
			var cap = obj.table.filter(function (agent){ return agent.grade == "Capitaine"});
			var ltn = obj.table.filter(function (agent){ return agent.grade == "Lieutenant"});
			var insp = obj.table.filter(function (agent){ return agent.grade == "Inspecteur"});
			var sgtchef = obj.table.filter(function (agent){ return agent.grade == "Sergent Chef"});
			var sgt = obj.table.filter(function (agent){ return agent.grade == "Sergent"});
			var offsup = obj.table.filter(function (agent){ return agent.grade == "Officier Supérieur"});
			var off = obj.table.filter(function (agent){ return agent.grade == "Officier"});
			var cad = obj.table.filter(function (agent){ return agent.grade == "Cadet"});
			com.sort(function(a,b) { return a.matricule - b.matricule; });
			cap.sort(function(a,b) { return a.matricule - b.matricule; });
			ltn.sort(function(a,b) { return a.matricule - b.matricule; });
			insp.sort(function(a,b) { return a.matricule - b.matricule; });
			sgtchef.sort(function(a,b) { return a.matricule - b.matricule; });
			sgt.sort(function(a,b) { return a.matricule - b.matricule; });
			offsup.sort(function(a,b) { return a.matricule - b.matricule; });
			off.sort(function(a,b) { return a.matricule - b.matricule; });
			cad.sort(function(a,b) { return a.matricule - b.matricule; });
			//console.log(obj.table.length);
			
			
			effectifTXT += `Commissaire :\n${egals} \n`;
			effectifTXT += listgrade(com)
			effectifTXT += `\nCapitaine :\n${egals} \n`;
			effectifTXT += listgrade(cap)
			effectifTXT += `\nLieutenant :\n${egals} \n`;
			effectifTXT += listgrade(ltn)
			effectifTXT += `\nInspecteur :\n${egals} \n`;
			effectifTXT += listgrade(insp)
			effectifTXT += `\nSergent-chef :\n${egals} \n`;
			effectifTXT += listgrade(sgtchef)
			effectifTXT += `\nSergent :\n${egals} \n`;
			effectifTXT += listgrade(sgt)
			effectifTXT1 += `Officier Supérieur :\n${egals} \n`;
			effectifTXT1 += listgrade(offsup)
			effectifTXT1 += `\nOfficier :\n${egals} \n`;
			effectifTXT1 += listgrade(off)
			effectifTXT1 += `\nCadet :\n${egals} \n`;
			effectifTXT1 += listgrade(cad)
			
			
			effectifTXT += "```";
			effectifTXT1 += "```";
			EffectifChannel.send(effectifTXT);
			EffectifChannel.send(effectifTXT1);
		}
	});
}
function listgrade(test)
{	let txt = '';
	for (let index = 0; index < test.length; index++) {
		let formattedNumber = test[index].matricule.toLocaleString('en-US', {
			minimumIntegerDigits: 2,
			useGrouping: false
		  })
		  txt += `        - ${formattedNumber} : ${test[index].nom} (${test[index].number}) \n`;
	};
	return txt;
}

async function formationsLspd()
{	

	const channel = client.channels.cache.get('971551551669809212');
	channel.bulkDelete(99, true).catch(error => {
		console.error(error);
		channel.send({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
	});

	fs.readFile(agent, 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log("erreur catch1 " + err);
		} else {
			obj = JSON.parse(data); //now it's an object
			
			//console.log(obj.table.length);
			for (let index = 0; index < obj.table.length; index++) {
				const member = obj.table[index];
				let formattedNumber = member.matricule.toLocaleString('en-US', {
					minimumIntegerDigits: 2,
					useGrouping: false
				  })
				FormationLspdEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`[${formattedNumber}] ${member.grade} ${member.nom}`)
					.setAuthor({ name: 'IRIS'})
					.setDescription(`${member.grade}`)
					.addFields(
						{ name: 'Henry 2', value: `${member.henry}`, inline: true },
						{ name: 'Marie', value: `${member.marie}`, inline: true },
						{ name: 'Sierra', value: `${member.sierra}`, inline: true },
						{ name: 'William', value: `${member.william}`, inline: true },
					)
					.setTimestamp()
					.setFooter({ text: 'Merci Raitrax :)' })
				channel.send({ embeds: [FormationLspdEmbed] }).then(sent => { // 'sent' is that message you just sent
					let id = sent.id;
					console.log(id);
					obj.table[index].idformation = id
					json = JSON.stringify(obj); //convert it back to json
					//console.log(json);
					fs.writeFile(agent, json, 'utf8', function(err){
						if (err){
							console.log("erreur catch2 " +err);
						}}
					);
			    });
			};
		}
	});
}



client.login(token);
