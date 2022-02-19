const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require("../database/database");
const Lspd = require("../models/Lspd");

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
			// equivalent to: DELETE from tags WHERE name = ?;
		//const rowCount = await Lspd.destroy({ where: { matricule: Matricule } });
		//const rowCount1 = await Formations.destroy({ where: { matricule: Matricule } });

		//if (!rowCount) return interaction.reply({content:"Ce matricule LSPD n'existe pas.", ephemeral: true});

		//return interaction.reply({content:'Membre LSPD supprimé.', ephemeral: true});
	},
};
