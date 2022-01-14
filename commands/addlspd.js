const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require("../database/database");
const Lspd = require("../models/Lspd");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addlspd')
		.setDescription("ajout d'un membre LSPD")
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
			console.log(Matricule);
			console.log(Nom);
			console.log(Number);
			console.log(Grade);

			try {
				// equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
				
				console.log("ajout LSPD");
				const Toto = "Non validée"; 

				const LSPD = await Lspd.create({
					matricule: Matricule,
					nom: Nom,
					number: Number,
					grade: Grade,
					braquages: Toto,
					colonneswat: Toto,
					penitencier: Toto,
					henryu: Toto,
					henryd: Toto,
					marie: Toto,
					sierra: Toto,
					poursuite: Toto,
					persecours: Toto/**/
				});
				console.log("Reply LSPD");
				return interaction.reply({content:`LSPD [${LSPD.matricule}] ${LSPD.nom} (${LSPD.number}) ajouté au grade de ${LSPD.grade}. Braquage : ${LSPD.braquages}`, ephemeral: true});
			} catch (error) {
				console.log("erreur catch" + error.name + " " + error.data);
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply({content:"Cette personne fait déjà partie de l'effectif!", ephemeral: true});
				}
				return interaction.reply({content:"Quelque chose c'est mal passé dans l'ajout du membre LSPD.", ephemeral: true});
			}
	},
};
