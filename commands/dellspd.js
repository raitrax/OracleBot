const { SlashCommandBuilder } = require('@discordjs/builders');
const agent = './data/agentsLSPD.json';
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dellspd')
		.setDescription("Supression d'un membre LSPD")
		.addStringOption(option => option.setName('matricule').setDescription("matricule de l'agent"))
		//.addStringOption(option => option.setName('nom').setDescription("matricule de l'agent"))
		//.addStringOption(option => option.setName('number').setDescription("matricule de l'agent"))
		//.addStringOption(option => option.setName('grade').setDescription("matricule de l'agent"))
		,
	async execute(interaction) {
			const Matricule = interaction.options.getString('matricule');
			console.log(Matricule);
			console.log("suppression LSPD");
			let found = false;
			// equivalent to: DELETE from tags WHERE name = ?;
		//const rowCount = await Lspd.destroy({ where: { matricule: Matricule } });
		//const rowCount1 = await Formations.destroy({ where: { matricule: Matricule } });
		fs.readFile(agent, 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log("erreur catch1 " + err);
			} else {
				obj = JSON.parse(data); //now it's an object

				//console.log(obj.table.length);
				for (let index = 0; index < obj.table.length; index++) {
					const member = obj.table[index];
					if (member.matricule == Matricule) {
						found = true;
						obj.table.splice(index, 1);

					}
				};
				//console.log(obj);
				json = JSON.stringify(obj); //convert it back to json

				//console.log(obj);
				fs.writeFile(agent, json, 'utf8', function (err) {
					if (err) {
						console.log("erreur catch2 " + err);
					}
				}); // write it back 
			}
			console.log(found);
			if (!found) return interaction.reply({content:"Ce matricule LSPD n'existe pas.", ephemeral: true});

			return interaction.reply({content:'Membre LSPD supprimé.', ephemeral: true});
		});
		
	},
};
