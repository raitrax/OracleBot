const { SlashCommandBuilder } = require('discord.js');
const leagues = require("../models/leagues");
const { adminID, presentationID } = require('../config.json');
const functions = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('supligue')
		.setDescription(`Permet de supprimer une ligue dans la BDD et le rôle associer`)
		.addStringOption(option =>
			option.setName('nom')
				.setDescription(`Nom de la ligue`)
				.setAutocomplete(true)
				.setRequired(true)
		)
	//.addUserOption(option => option.setName('tag').setDescription(`Tag de l'agent`).setRequired(true))
	,

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let member = interaction.guild.members.cache.get(interaction.user.id)
		if (member.roles.cache.has(adminID)) {
			const nom = interaction.options.getString('nom');

			const LeaguesList = await leagues.findOne({ where: { name: nom } });
			if (LeaguesList != null) {
				console.log("déjà présent : " + LeaguesList.length);
				await leagues.destroy({ where: { name: LeaguesList.name } });
				await interaction.guild.roles.cache.find(role => role.name === nom).delete();
				await functions.service(interaction.client.channels.cache.get(presentationID));

				return await interaction.editReply({ content: `Vous avez supprimer la ligue ${nom} sur le serveur.`, ephemeral: true });
			}
			else {
				return await interaction.editReply({ content: `Cette ligue n'est pas présente sur le serveur.`, ephemeral: true });
			}
		} else {
			return await interaction.editReply({ content: `Vous n'avez pas les droits pour cette commande.`, ephemeral: true });
		}
	},
};
