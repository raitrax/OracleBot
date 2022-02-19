const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Montre les infos de ton serveur.'),
	async execute(interaction) {
		return interaction.reply(`Nom du serveur : ${interaction.guild.name}\nNombre de total de membre : ${interaction.guild.memberCount}`);
	},
};
