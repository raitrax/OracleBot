const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require("../database/database");
const Lspd = require("../models/Lspd");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('showlspd')
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

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		//const LSPDsrch = await Lspd.findOne({ where: { matricule: Matricule } });
		
		
		//return interaction.reply(`Could not find tag: ${LSPDsrch}`);

		//return interaction.reply(`Le matricule ${Matricule} est introuvable.`);
	},
};
