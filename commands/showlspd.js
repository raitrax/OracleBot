const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const agent = './data/agentsLSPD.json';
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showlspd')
		.setDescription("édition d'un membre LSPD")
		.addStringOption(option => option.setName('matricule').setDescription("matricule de l'agent")),
	async execute(interaction) {
		const Matricule = interaction.options.getString('matricule');
		var exampleEmbed = new MessageEmbed();
		fs.readFile(agent, 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log("erreur catch1 " + err);
			} else {
				obj = JSON.parse(data); //now it's an object
				
				//console.log(obj.table.length);
				for (let index = 0; index < obj.table.length; index++) {
					const member = obj.table[index];
					if (member.matricule == Matricule) {
						found = true;
						exampleEmbed = new MessageEmbed()
							.setColor('#0099ff')
							.setTitle(`[${member.matricule}] ${member.nom}`)
							.setAuthor({ name: 'IRIS'})
							.setDescription(`${member.grade}`)
							.addFields(
								//{ name: '\u200B', value: '\u200B' },
								{ name: 'Braquages', value: `${member.braquages}`, inline: true },
								{ name: 'Colonnes SWAT', value: `${member.colonneswat}`, inline: true },
								{ name: 'Penitencier', value: `${member.penitencier}`, inline: true },
								{ name: 'Henry 1', value: `${member.henryu}`, inline: true },
								{ name: 'Henry 2', value: `${member.henryd}`, inline: true },
								{ name: 'Marie', value: `${member.marie}`, inline: true },
								{ name: 'Sierra', value: `${member.sierra}`, inline: true },
								{ name: 'Poursuite', value: `${member.poursuite}`, inline: true },
								{ name: '1er Secours', value: `${member.persecours}`, inline: true },
							)
							.setTimestamp()
							//.setFooter({ text: 'merci iris :)' });

					}
				};
			}
			console.log(found);
			if (!found) return interaction.reply({content:"Ce matricule LSPD n'existe pas.", ephemeral: true});

			return interaction.reply({embeds: [exampleEmbed], ephemeral: false});
		});
	},
};
