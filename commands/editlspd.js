const { SlashCommandBuilder } = require('@discordjs/builders');
const agent = './data/agentsLSPD.json';
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('editlspd')
		.setDescription("édition d'un membre LSPD")
		.addStringOption(option => option.setName('matricule').setDescription("matricule de l'agent"))
		.addStringOption(option => option.setName('nom').setDescription("matricule de l'agent"))
		.addStringOption(option => option.setName('number').setDescription("matricule de l'agent"))
		.addStringOption(option => option.setName('grade').setDescription("matricule de l'agent")
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

		console.log("edit LSPD");

		fs.readFile(agent, 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log("erreur catch1 " + err);
			} else {
				obj = JSON.parse(data); //now it's an object

				//console.log(obj.table.length);
				for (let index = 0; index < obj.table.length; index++) {
					const member = obj.table[index];
					console.log("coucou le matricule : " + member.matricule);
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
					}
				};
				//console.log(obj);
				json = JSON.stringify(obj); //convert it back to json
			fs.writeFile(agent, json, 'utf8', function(err){
				if (err){
					console.log("erreur catch2 " +err);
				}}); // write it back 
				if (!found) return interaction.reply({content:"Ce matricule LSPD n'existe pas.", ephemeral: true});

				return interaction.reply({content:'Membre LSPD édité.', ephemeral: true});
		}});
	},
};
