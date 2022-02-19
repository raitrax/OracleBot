const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Selectionne un membre a kick du discord (pas vraiment pour le moment).')
		.addUserOption(option => option.setName('target').setDescription('Le membre à kick')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		return interaction.reply({ content: `T'as essayé de kick : ${user.username}`, ephemeral: true });
	},
};
