const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	MessageFlags,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require('discord.js');
const { config, isId } = require('../lib/config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolepanel')
		.setDescription('Publie le panneau de sélection de rôles (auto-rôles)')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
		const r = config.roles || {};
		const items = (r.items || []).filter((i) => isId(i.roleId));
		if (!items.length) {
			return interaction.reply({
				content: '⚠️ Aucun rôle valide dans `config.json` (section `roles.items`). Renseigne les `roleId` puis redéploie.',
				flags: MessageFlags.Ephemeral,
			});
		}

		const embed = new EmbedBuilder()
			.setTitle(r.title || '🎭 Rôles')
			.setDescription(r.description || 'Clique pour obtenir ou retirer un rôle.')
			.setColor(0x5865f2);

		// Discord : max 5 boutons par rangée, max 5 rangées.
		const rows = [];
		for (let i = 0; i < items.length && rows.length < 5; i += 5) {
			const row = new ActionRowBuilder();
			for (const it of items.slice(i, i + 5)) {
				const btn = new ButtonBuilder()
					.setCustomId(`role:${it.roleId}`)
					.setLabel(it.label || 'Rôle')
					.setStyle(ButtonStyle.Secondary);
				if (it.emoji) btn.setEmoji(it.emoji);
				row.addComponents(btn);
			}
			rows.push(row);
		}

		await interaction.channel.send({ embeds: [embed], components: rows });
		await interaction.reply({ content: '✅ Panneau de rôles publié dans ce salon.', flags: MessageFlags.Ephemeral });
	},
};
