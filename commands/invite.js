const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Donne le lien pour rejoindre le serveur.'),
	async execute(interaction) {
		return interaction.reply({ content: `Voici le lien du serveur : https://discord.gg/ChFvsXuEat`, ephemeral: false });
	},
};
