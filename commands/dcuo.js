const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const fs = require('fs');
const { ownersID } = require('../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dcuo')
        .setDescription('Recherche stat personnage DCUO')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription(`Nom du personnage`)
                .setRequired(true)

        ),
    async execute(interaction) {
        const nom = interaction.options.getString('nom');
        await interaction.deferReply();

        const characterResult = await request(`https://census.daybreakgames.com/s:raitrax/get/dcuo/character?name=*${nom}&c:case=false&c:limit=1&c:exactMatchFirst=true`);
        const { character_list } = await characterResult.body.json();

        console.log(character_list);
        if (!character_list.length) {
            return await interaction.editReply(`Aucun résultat trouvé pour le personnage : **${nom}**.`);
        }
        const [answer] = character_list;

        let ligueName = "";
        const guidRosterResult = await request(`https://census.daybreakgames.com/s:raitrax/get/dcuo/guild_roster?character_id=${answer.character_id}`);
        const { guild_roster_list } = await guidRosterResult.body.json();
        if (!guild_roster_list.length) {
            ligueName = "Aucun";
        } else {
            const [answer2] = guild_roster_list;
            const guidListResult = await request(`https://census.daybreakgames.com/s:raitrax/get/dcuo/guild?guild_id=${answer2.guild_id}`);
            const { guild_list } = await guidListResult.body.json();
            if (!guild_list.length) {
                ligueName = "Aucun";
            }
            else {
                const [answer3] = guild_list;
                ligueName = answer3.name;
            }
        }


        let Resistance = `Santé : ${answer.max_health}\nPouvoir : ${answer.max_power}\nDéfense : ${answer.defense}\nEndurance : ${answer.toughness}`;
        let Action = `Puissance : ${answer.might}\nPrécision : ${answer.precision}\nVitalisation : ${answer.vitalization}\nRestauration : ${answer.restoration}\nDominance : ${answer.dominance}`;

        let deplacement = "";
        switch (answer.movement_mode_id) {
            case '3313':
                deplacement = "Vol";
                break;
            case '3314':
                deplacement = "Super vitesse";
                break;
            case '3527':
                deplacement = "Planeur";
                break;
            case '3317':
                deplacement = "Surf";
                break;
            default:
                deplacement = "Non trouvé";
                break;
        }

        let pouvoir = "";
        switch (answer.power_type_id) {
            case '1810455':
                pouvoir = "Quantum";
                break;
            case '7019':
                pouvoir = "Mental";
                break;
            case '00000':
                pouvoir = "Feu";
                break;
            case '0000':
                pouvoir = "Glace";
                break;
            case '175798':
                pouvoir = "Gadget";
                break;
            case '000':
                pouvoir = "Lantern Vert";
                break;
            case '00':
                pouvoir = "Lantern Jaune";
                break;
            case '0':
                pouvoir = "Rage";
                break;
            case '1':
                pouvoir = "Munition";
                break;
            case '2325':
                pouvoir = "Electrique";
                break;
            case '2':
                pouvoir = "Nature";
                break;
            case '3':
                pouvoir = "Atomic";
                break;
            case '4':
                pouvoir = "Celeste";
                break;
            case '5':
                pouvoir = "Sorcier";
                break;
            case '6':
                pouvoir = "Eau";
                break;
            case '3316':
                pouvoir = "Terre";
                break;
            default:
                pouvoir = "Non trouvé";
                break;
        }
        const embed = new EmbedBuilder()
            .setColor(0xEFFF00)
            .setTitle(answer.name)
            .addFields(
                { name: 'CR', value: answer.combat_rating, inline: true },
                { name: 'PVP', value: answer.pvp_combat_rating, inline: true },
                { name: 'SP', value: answer.skill_points, inline: true },
                { name: 'Pouvoir', value: pouvoir, inline: true },
                { name: 'Déplacement', value: deplacement, inline: true },
                { name: 'Ligue', value: ligueName, inline: true },
                { name: 'Resistance', value: Resistance, inline: true },
                { name: 'Action', value: Action, inline: true }
            );

        await interaction.editReply({ embeds: [embed] });
    },
};
