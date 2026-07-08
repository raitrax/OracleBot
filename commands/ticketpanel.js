const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js');
const { config } = require('../lib/config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticketpanel')
		.setDescription("Publie le panneau d'ouverture de tickets")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
		const t = config.tickets || {};
		const embed = new EmbedBuilder()
			.setTitle(t.title || '🎫 Support')
			.setDescription(t.description || 'Clique sur le bouton pour ouvrir un ticket.')
			.setColor(0x57f287);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('ticket:open')
				.setLabel(t.buttonLabel || 'Ouvrir un ticket')
				.setStyle(ButtonStyle.Success)
				.setEmoji('🎫'),
		);

		await interaction.channel.send({ embeds: [embed], components: [row] });
		await interaction.reply({ content: '✅ Panneau de tickets publié dans ce salon.', flags: MessageFlags.Ephemeral });
	},
};
