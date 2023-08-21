const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leagues = require("../models/leagues");
const { adminID, presentationID } = require('../config.json');
const functions = require('../functions');
const artefacts = require("../models/artefacts");
const prixsources = require("../models/prixsources");
const { Op } = require("sequelize");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('artefact')
		.setDescription(`Permet de connaitre le requis pour monter un artéfact au niveau souhaité`)
		.addIntegerOption(option =>
			option.setName('actuel')
				.setDescription(`Niveau actuel`)
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('desire')
				.setDescription(`Niveau désiré`)
				.addChoices(
					{ name: '20', value: 20 },
					{ name: '40', value: 40 },
					{ name: '60', value: 60 },
					{ name: '80', value: 80 },
					{ name: '100', value: 100 },
					{ name: '120', value: 120 },
					{ name: '140', value: 140 },
					{ name: '160', value: 160 },
					{ name: '180', value: 180 },
					{ name: '200', value: 200 }
				)
				.setRequired(true)
		),

	async execute(interaction) {
		await interaction.deferReply();
		let member = interaction.guild.members.cache.get(interaction.user.id)
		if (member.roles.cache.has(adminID)) {
			const actuel = interaction.options.getInteger('actuel');
			const desire = interaction.options.getInteger('desire');
			const artefact = await artefacts.findAll({ where: { lvl: { [Op.between]: [actuel + 1, desire], } } });
			if (actuel < 0 || actuel > 200) {
				return await interaction.editReply({ content: `Vous devez avoir un niveau entre 0 et 200.`, ephemeral: true });

			}
			const embed = new EmbedBuilder()
				.setColor('#EFFF00')
				.setTitle(`Pour passer un Artéfact lvl ${actuel} au lvl ${desire}, il faut :`);


			let fields = [];
			let dionesiumfield = { name: "", value: "" };
			let quantumfield = { name: "", value: "" };
			let paradoxfield = { name: "", value: "" };
			let xpfield = { name: "", value: "" };
			let totalfield = { name: "", value: "" };
			let dionesiumCount = 0;
			let quantumCount = 0;
			let paradoxCount = 0;
			let xpCount = 0;
			let totalMarques = 0;
			for (const arte of artefact) {
				console.log(arte.lvl);
				console.log(arte.dionesium);
				console.log(arte.quantum);
				console.log(arte.paradox);
				console.log(arte.xp);

				dionesiumCount += arte.dionesium;
				quantumCount += arte.quantum;
				paradoxCount += arte.paradox;
				xpCount += arte.xp;
			}
			let prixDionesium = await prixsources.findOne({ where: { item: 'Dionesium' } });
			let totalPrixDionesium = dionesiumCount * prixDionesium.prix;
			dionesiumfield.name = 'Dionesium';
			dionesiumfield.value = `${dionesiumCount} (${totalPrixDionesium} Marque sources)`;
			fields.push(dionesiumfield);
			totalMarques = totalPrixDionesium;
			if (quantumCount != 0) {
				let prixQuantum = await prixsources.findOne({ where: { item: 'Energie de champ quantique' } });
				let totalPrixQuantum = quantumCount * prixQuantum.prix;
				quantumfield.name = 'Energie de champ quantique';
				quantumfield.value = `${quantumCount} (${totalPrixQuantum} Marque sources)`;
				totalMarques += totalPrixQuantum;
				fields.push(quantumfield);
			}
			if (paradoxCount != 0) {
				let prixParadox = await prixsources.findOne({ where: { item: 'Energie paradoxale' } });
				let totalPrixParadox = paradoxCount * prixParadox.prix;
				paradoxfield.name = 'Energie paradoxale';
				paradoxfield.value = `${paradoxCount} (${totalPrixParadox} Marque sources)`;
				totalMarques += totalPrixParadox;
				fields.push(paradoxfield);
			}
			xpfield.name = `Metal NTH`;
			xpfield.value = `${xpCount}`;
			fields.push(xpfield);
			totalfield.name = 'Total';
			totalfield.value = `${totalMarques} Marque sources`

			fields.push(totalfield);

			embed.addFields(fields);

			return await interaction.editReply({ embeds: [embed], ephemeral: false });

			//return await interaction.editReply({ content: `Recherche du résultat`, ephemeral: true });
		} else {
			return await interaction.editReply({ content: `Vous n'avez pas les droits pour cette commande.`, ephemeral: true });
		}
	},
};
