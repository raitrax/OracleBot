const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Réponds avec un : Pong!'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};
