const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickuser')
		.setDescription('affiche le pseudo')
		.addUserOption(option => option.setName('tag').setDescription(`Tag de l'agent`).setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const Member = interaction.options.getMember('tag');
		return await interaction.editReply({ content: `id : ${Member.user.id} Pseudo : ${Member.nickname}`, ephemeral: true });
	},
};
