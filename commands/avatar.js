const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription("Récupère l'URL de l'avatar de l'utilisateur selectionné, où le votre.")
		.addUserOption(option => option.setName('target').setDescription("L'avatar de l'utilisateur à afficher")),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if (user) return interaction.reply(`Avatar de ${user.username} : ${user.displayAvatarURL({ dynamic: true })}`);
		return interaction.reply(`Votre avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`);
	},
};
