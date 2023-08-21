const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const leagues = require("../models/leagues");
const { adminID, presentationID } = require('../config.json');
const functions = require('../functions');
const allies = require("../models/allies");
const prixsources = require("../models/prixsources");
const { Op } = require("sequelize");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ally')
		.setDescription(`Permet de connaitre le requis pour monter un allier au niveau souhaité`)
		.addStringOption(option =>
			option.setName('type')
				.setDescription(`Type d'allié`)
				.addChoices(
					{ name: 'rare', value: 'rare' },
					{ name: 'epique', value: 'epique' },
					{ name: 'legendaire', value: 'legendaire' }
				)
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('actuel')
				.setDescription(`Niveau actuel`)
				.addChoices(
					{ name: '1', value: 1 },
					{ name: '2', value: 2 },
					{ name: '3', value: 3 },
					{ name: '4', value: 4 },
					{ name: '5', value: 5 },
					{ name: '6', value: 6 },
					{ name: '7', value: 7 },
					{ name: '8', value: 8 },
					{ name: '9', value: 9 },
					{ name: '10', value: 10 }
				)
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('desire')
				.setDescription(`Niveau désiré`)
				.addChoices(
					{ name: '2', value: 2 },
					{ name: '3', value: 3 },
					{ name: '4', value: 4 },
					{ name: '5', value: 5 },
					{ name: '6', value: 6 },
					{ name: '7', value: 7 },
					{ name: '8', value: 8 },
					{ name: '9', value: 9 },
					{ name: '10', value: 10 }
				)
				.setRequired(true)
		),

	async execute(interaction) {
		await interaction.deferReply();
		let member = interaction.guild.members.cache.get(interaction.user.id)
		if (member.roles.cache.has(adminID)) {
			const type = interaction.options.getString('type');
			const actuel = interaction.options.getInteger('actuel');
			const desire = interaction.options.getInteger('desire');
			const allycat = await allies.findAll({ where: { type: type, lvl: { [Op.between]: [actuel + 1, desire], } } });

			const embed = new EmbedBuilder()
				.setColor('#EFFF00')
				.setTitle(`Pour passer un Allié ${type} lvl ${actuel} au lvl ${desire}, il faut :`);


			switch (type) {
				case "rare":
					if (actuel > 5 || desire > 5) {
						return interaction.editReply({ content: `Un allié rare ne peut pas avoir plus de 5 niveaux!`, ephemeral: true });
					}

					break;
				case "epique":
					if (actuel > 8 || desire > 8) {
						return interaction.editReply({ content: `Un allié épique ne peut pas avoir plus de 8 niveaux !`, ephemeral: true });
					}
					break;
				case "legendaire":

					break;
				default:
					break;
			}

			let fields = [];
			let rarefield = { name: "", value: "" };
			let epiquefield = { name: "", value: "" };
			let legendairefield = { name: "", value: "" };
			let favorfield = { name: "", value: "" };
			let totalfield = { name: "", value: "" };
			let rareCount = 0;
			let epiqueCount = 0;
			let legendaryCount = 0;
			let favorCount = 0;
			let totalMarques = 0;
			for (const ally of allycat) {
				console.log(ally.type);
				console.log(ally.lvl);
				console.log(ally.rare);
				console.log(ally.epique);
				console.log(ally.legendary);
				console.log(ally.favor);

				rareCount += ally.rare;
				epiqueCount += ally.epique;
				legendaryCount += ally.legendary;
				favorCount += ally.favor;

			}
			let prixRare = await prixsources.findOne({ where: { item: 'Alliance rare' } });
			let totalPrixRare = rareCount * prixRare.prix;
			rarefield.name = 'Alliance rare';
			rarefield.value = `${rareCount} (${totalPrixRare} Marque sources)`;
			fields.push(rarefield);
			totalMarques = totalPrixRare;
			if (epiqueCount != 0) {
				let prixEpique = await prixsources.findOne({ where: { item: 'Alliance epique' } });
				let totalPrixEpique = epiqueCount * prixEpique.prix;
				epiquefield.name = 'Alliance epique';
				epiquefield.value = `${epiqueCount} (${totalPrixEpique} Marque sources)`;
				totalMarques += totalPrixEpique;
				fields.push(epiquefield);
			}
			if (legendaryCount != 0) {
				let prixLegendary = await prixsources.findOne({ where: { item: 'Alliance legendaire' } });
				let totalPrixLegendary = legendaryCount * prixLegendary.prix;
				legendairefield.name = 'Alliance legendaire';
				legendairefield.value = `${legendaryCount} (${totalPrixLegendary} Marque sources)`;
				totalMarques += totalPrixLegendary;
				fields.push(legendairefield);
			}
			favorfield.name = `Faveur d'alliés`;
			favorfield.value = `${favorCount}`;
			fields.push(favorfield);
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
