const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Message, Intents, MessageEmbed } = require('discord.js');
const agent = './data/agentsLSPD.json';
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
module.exports = {
	data: new SlashCommandBuilder()
		.setName('editlspd')
		.setDescription("édition d'un membre LSPD")
		.addStringOption(option => option.setName('matricule').setDescription("matricule de l'agent"))
		.addStringOption(option => option.setName('nom').setDescription("nom de l'agent"))
		.addStringOption(option => option.setName('number').setDescription("numéro de l'agent"))
		.addStringOption(option => option.setName('grade').setDescription("gradede l'agent")
		.addChoice("Cadet", "Cadet")
		.addChoice("Officier", "Officier")
		.addChoice("Officier Supérieur", "Officier Supérieur")
		.addChoice("Sergent", "Sergent")
		.addChoice("Sergent Chef", "Sergent Chef")
		.addChoice("Inspecteur", "Inspecteur")
		.addChoice("Lieutenant", "Lieutenant")
		.addChoice("Capitaine", "Capitaine")
		.addChoice("Commissaire", "Commissaire"))
		.addStringOption(option => option.setName('marie').setDescription("formation à mettre à jour")
		.addChoice("Validé", "Validé")
		.addChoice("Non Validé", "Non Validé")
		.addChoice("A Refaire", "A Refaire"))
		.addStringOption(option => option.setName('sierra').setDescription("formation à mettre à jour")
		.addChoice("Validé", "Validé")
		.addChoice("Non Validé", "Non Validé")
		.addChoice("A Refaire", "A Refaire"))
		.addStringOption(option => option.setName('henry').setDescription("formation à mettre à jour")
		.addChoice("Validé", "Validé")
		.addChoice("Non Validé", "Non Validé")
		.addChoice("A Refaire", "A Refaire"))
		.addStringOption(option => option.setName('william').setDescription("formation à mettre à jour")
		.addChoice("Validé", "Validé")
		.addChoice("Non Validé", "Non Validé")
		.addChoice("A Refaire", "A Refaire")),

	async execute(interaction) {
		const Matricule = interaction.options.getString('matricule');
		const Nom = interaction.options.getString('nom');
		const Number = interaction.options.getString('number');
		const Grade = interaction.options.getString('grade');
		const Marie = interaction.options.getString('marie');
		const Sierra = interaction.options.getString('sierra');
		const Henry = interaction.options.getString('henry');
		const William = interaction.options.getString('william');
		
		console.log("edit LSPD");

		fs.readFile(agent, 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log("erreur catch1 " + err);
			} else {
				obj = JSON.parse(data); //now it's an object

				//console.log(obj.table.length);
				for (let index = 0; index < obj.table.length; index++) {
					const member = obj.table[index];
					//console.log("coucou le matricule : " + member.matricule);
					if (member.matricule == Matricule) {
						found = true;
						if (Matricule) {
							obj.table[index].matricule = Matricule;
						}
						if (Nom) {
							obj.table[index].nom = Nom;
						}
						if (Number) {
							obj.table[index].number = Number;
						}
						if (Grade) {
							obj.table[index].grade = Grade;
						}
						if (Marie) {
							obj.table[index].marie = Marie;
						}
						if (Sierra) {
							obj.table[index].sierra = Sierra;
						}
						if (Henry) {
							obj.table[index].henry = Henry;
						}
						if (William) {
							obj.table[index].william = William;
						}
					}
				};
				//console.log(obj);
				json = JSON.stringify(obj); //convert it back to json
			fs.writeFile(agent, json, 'utf8', function(err){
				if (err){
					console.log("erreur catch2 " +err);
				}}); // write it back 
				if (!found) return interaction.reply({content:"Ce matricule LSPD n'existe pas.", ephemeral: true});
				//trierLeLSPD();
				for (let index = 0; index < obj.table.length; index++) {
					const member = obj.table[index];
					
					if (member.matricule == Matricule) {
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
							.setFooter({ text: 'Merci Raitrax :)' });
						//const FormationChannel = ;
						interaction.client.channels.cache.get('971551551669809212').messages.fetch(member.idformation)
							.then(message => {
								message.edit({embeds: [FormationLspdEmbed]})
							});
						//client.channels.cache.get('971551551669809212').messages.fetch(member.idformation).then(msg => msg.edit({embeds: [FormationLspdEmbed]}));
						return interaction.reply({content:'Membre LSPD édité.', ephemeral: true});
					}
				}
			}
		});
	},
};

function trierLeLSPD(lspdAgent) {
	var com = lspdAgent.filter(function (agent){ return agent.grade == "Commissaire"});
	var cap = lspdAgent.filter(function (agent){ return agent.grade == "Capitaine"});
	var ltn = lspdAgent.filter(function (agent){ return agent.grade == "Lieutenant"});
	var insp = lspdAgent.filter(function (agent){ return agent.grade == "Inspecteur"});
	var sgtchef = lspdAgent.filter(function (agent){ return agent.grade == "Sergent Chef"});
	var sgt = lspdAgent.filter(function (agent){ return agent.grade == "Sergent"});
	var offsup = lspdAgent.filter(function (agent){ return agent.grade == "Officier Supérieur"});
	var off = lspdAgent.filter(function (agent){ return agent.grade == "Officier"});
	var cad = lspdAgent.filter(function (agent){ return agent.grade == "Cadet"});
	var com2 = com.slice(0);
	com2.sort(function(a,b) { return a.matricule - b.matricule; });
	var cap2 = cap.slice(0);
	cap2.sort(function(a,b) { return a.matricule - b.matricule; });

	var ltn2 = ltn.slice(0);
	ltn2.sort(function(a,b) { return a.matricule - b.matricule; });

	var insp2 = insp.slice(0);
	insp2.sort(function(a,b) { return a.matricule - b.matricule; });

	var sgtchef2 = sgtchef.slice(0);
	sgtchef2.sort(function(a,b) { return a.matricule - b.matricule; });

	var sgt2 = sgt.slice(0);
	sgt2.sort(function(a,b) { return a.matricule - b.matricule; });
	
	var offsup2 = offsup.slice(0);
	offsup2.sort(function(a,b) { return a.matricule - b.matricule; });
	
	var off2 = off.slice(0);
	off2.sort(function(a,b) { return a.matricule - b.matricule; });
	
	var cad2 = cad.slice(0);
	cad2.sort(function(a,b) { return a.matricule - b.matricule; });

	var table = Object.assign(com2, cap2, ltn2, insp2, sgtchef2, sgt2, offsup2, off2, cad2 );

	console.log(table);
	console.log(com2);
	//table.push(com2);

	console.log(cap2);
	//table.push(cap2);

	console.log(ltn2);
	//table.push(ltn2);

	console.log(insp2);
	//table.push(insp2);

	console.log(sgtchef2);
	//table.push(sgtchef2);

	console.log(sgt2);
	//table.push(sgt2);

	console.log(offsup2);
	//table.push(offsup2);

	console.log(off2);
	//table.push(off2);

	console.log(cad2);
	//table.push(cad2);

  }