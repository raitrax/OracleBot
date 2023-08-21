const { SlashCommandBuilder } = require('discord.js');
const leagues = require("../models/leagues");
const { adminID, presentationID } = require('../config.json');
const functions = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addligue')
		.setDescription(`Permet d'ajouter une ligue dans la BDD et créer un rôle`)
		.addStringOption(option =>
			option.setName('nom')
				.setDescription(`Nom de la ligue`)
				.setRequired(true)
		)
	//.addUserOption(option => option.setName('tag').setDescription(`Tag de l'agent`).setRequired(true))
	,

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		let member = interaction.guild.members.cache.get(interaction.user.id)
		if (member.roles.cache.has(adminID)) {
			const nom = interaction.options.getString('nom');

			const LeaguesList = await leagues.findAll({ where: { name: nom } });
			if (LeaguesList.length > 0) {
				console.log("déjà présent : " + LeaguesList.length);
				return await interaction.editReply({ content: `Cette ligue est déjà présente sur le serveur.`, ephemeral: true });
			}
			const role = await interaction.guild.roles.create({
				name: nom,
				color: null,
				mentionable: true,
				hoist: true,
			});
			await leagues.create({
				name: nom,
				roleId: role.id,
			});
			await functions.service(interaction.client.channels.cache.get(presentationID));
			return await interaction.editReply({ content: `Vous avez ajouter la ligue ${nom} sur le serveur.`, ephemeral: true });
		} else {
			return await interaction.editReply({ content: `Vous n'avez pas les droits pour cette commande.`, ephemeral: true });
		}
	},
};
