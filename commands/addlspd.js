const { SlashCommandBuilder } = require('@discordjs/builders');
const agent = './data/agentsLSPD.json';
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addlspd')
		.setDescription("ajout d'un membre LSPD")
		.addStringOption(option => option.setName('matricule').setDescription("matricule de l'agent"))
		.addStringOption(option => option.setName('nom').setDescription("nom de l'agent"))
		.addStringOption(option => option.setName('number').setDescription("numéro de l'agent"))
		.addStringOption(option => option.setName('grade').setDescription("grade de l'agent")
		.addChoice("Cadet", "Cadet")
		.addChoice("Officier", "Officier")
		.addChoice("Officier Supérieur", "Officier Supérieur")
		.addChoice("Sergent", "Sergent")
		.addChoice("Sergent Chef", "Sergent Chef")
		.addChoice("Inspecteur", "Inspecteur")
		.addChoice("Lieutenant", "Lieutenant")
		.addChoice("Capitaine", "Capitaine")
		.addChoice("Commissaire", "Commissaire")),
	async execute(interaction) {
			const Matricule = interaction.options.getString('matricule');
			const Nom = interaction.options.getString('nom');
			const Number = interaction.options.getString('number');
			const Grade = interaction.options.getString('grade');
			console.log(Matricule);
			console.log(Nom);
			console.log(Number);
			console.log(Grade);

			//try {
				// equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
				
				console.log("ajout LSPD");
				const Toto = "Non validée"; 

				var LSPD2 = {
					"matricule": Matricule,
					"nom": Nom,
					"number": Number,
					"grade": Grade,
					"braquages": Toto,
					"colonneswat": Toto,
					"penitencier": Toto,
					"henryu": Toto,
					"henryd": Toto,
					"marie": Toto,
					"sierra": Toto,
					"poursuite": Toto,
					"persecours": Toto
				};
				fs.readFile(agent, 'utf8', function readFileCallback(err, data){
					if (err){
						console.log("erreur catch1 " +err);
					} else {
					obj = JSON.parse(data); //now it's an object
					//console.log(obj);
					obj.table.push(LSPD2); //add some data
					json = JSON.stringify(obj); //convert it back to json
					//console.log(obj);
					fs.writeFile(agent, json, 'utf8', function(err){
						if (err){
							console.log("erreur catch2 " +err);
						}}); // write it back 
				}});

				console.log("Reply LSPD");
				return interaction.reply({content:`LSPD [${LSPD2.matricule}] ${LSPD2.nom} (${LSPD2.number}) ajouté au grade de ${LSPD2.grade}.`, ephemeral: true});
	},
};
