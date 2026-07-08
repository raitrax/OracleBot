const {
	ChannelType,
	PermissionFlagsBits,
	MessageFlags,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { config, isId } = require('./config');

// Routeur : appelé par index.js pour toute interaction de type bouton.
// Le customId encode l'action, ex. "role:123", "ticket:open", "ticket:close".
async function handleButton(interaction) {
	const [action, arg] = interaction.customId.split(':');
	if (action === 'role') return toggleRole(interaction, arg);
	if (action === 'ticket' && arg === 'open') return openTicket(interaction);
	if (action === 'ticket' && arg === 'close') return closeTicket(interaction);
}

// ---------------------------------------------------------------------------
// Auto-rôles : un clic ajoute le rôle, un second le retire.
// ---------------------------------------------------------------------------
async function toggleRole(interaction, roleId) {
	const member = interaction.member;
	const has = member.roles.cache.has(roleId);
	try {
		if (has) {
			await member.roles.remove(roleId);
			await interaction.reply({ content: `❌ Rôle <@&${roleId}> retiré.`, flags: MessageFlags.Ephemeral });
		} else {
			await member.roles.add(roleId);
			await interaction.reply({ content: `✅ Rôle <@&${roleId}> ajouté !`, flags: MessageFlags.Ephemeral });
		}
	} catch (error) {
		console.error('Auto-rôle échoué :', error.message);
		await interaction.reply({
			content: "⚠️ Je n'ai pas pu modifier ce rôle. Vérifie que j'ai la permission **Gérer les rôles** et que **mon rôle est au-dessus** du rôle visé dans la hiérarchie.",
			flags: MessageFlags.Ephemeral,
		});
	}
}

// ---------------------------------------------------------------------------
// Tickets : ouverture d'un salon privé, fermeture par bouton.
// ---------------------------------------------------------------------------
async function openTicket(interaction) {
	const t = config.tickets || {};
	const guild = interaction.guild;

	// Un seul ticket ouvert par membre (repéré via le topic du salon).
	const already = guild.channels.cache.find(
		(c) =>
			c.type === ChannelType.GuildText &&
			c.name.startsWith('ticket-') &&
			c.topic &&
			c.topic.includes(interaction.user.id),
	);
	if (already) {
		return interaction.reply({ content: `⚠️ Tu as déjà un ticket ouvert : ${already}`, flags: MessageFlags.Ephemeral });
	}

	const safeName = interaction.user.username.replace(/[^a-z0-9]/gi, '').toLowerCase() || interaction.user.id;

	const overwrites = [
		{ id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
		{
			id: interaction.user.id,
			allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
		},
	];
	if (isId(t.supportRoleId)) {
		overwrites.push({
			id: t.supportRoleId,
			allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
		});
	}

	try {
		const channel = await guild.channels.create({
			name: `ticket-${safeName}`,
			type: ChannelType.GuildText,
			parent: isId(t.categoryId) ? t.categoryId : undefined,
			topic: `Ticket de ${interaction.user.tag} (${interaction.user.id})`,
			permissionOverwrites: overwrites,
		});

		const closeRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('ticket:close').setLabel('Fermer le ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒'),
		);
		const ping = isId(t.supportRoleId) ? `<@&${t.supportRoleId}> ` : '';
		await channel.send({
			content: `${ping}Salut <@${interaction.user.id}> ! Décris ta demande, le staff arrive. 🙌`,
			components: [closeRow],
		});

		await interaction.reply({ content: `✅ Ton ticket est ouvert : ${channel}`, flags: MessageFlags.Ephemeral });
	} catch (error) {
		console.error('Création ticket échouée :', error.message);
		await interaction.reply({
			content:
				"⚠️ Impossible de créer le ticket. Vérifie que j'ai la permission **Gérer les salons**" +
				(isId(t.categoryId) ? " et l'accès à la catégorie configurée." : '.'),
			flags: MessageFlags.Ephemeral,
		});
	}
}

async function closeTicket(interaction) {
	if (!interaction.channel?.name?.startsWith('ticket-')) {
		return interaction.reply({ content: '⚠️ Ce bouton ne fonctionne que dans un salon de ticket.', flags: MessageFlags.Ephemeral });
	}
	await interaction.reply({ content: '🔒 Fermeture du ticket dans 5 secondes…' });
	setTimeout(() => {
		interaction.channel.delete().catch((e) => console.error('Suppression ticket échouée :', e.message));
	}, 5000);
}

module.exports = { handleButton };
