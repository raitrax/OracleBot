const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription("Prune jusqu'à 99 messages.")
		.addIntegerOption(option => option.setName('amount').setDescription('Nombre de message à prune')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		if (amount <= 1 || amount > 100) {
			return interaction.reply({ content: "On a besoin d'un chiffre entre 1 et 99.", ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.reply({ content: `Vous avez supprimé \`${amount}\` messages.`, ephemeral: true });
	},
};
