const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Répond Pong!'),
	async execute(interaction) {
		console.log("pong");
		return interaction.reply('Pong!');
	},
};