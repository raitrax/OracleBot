const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profil')
        .setDescription('Gère les profils des utilisateurs')
        .addStringOption(option =>
            option.setName('choix')
                .setDescription(`gèrer le profil`)
                .setRequired(true)
                .addChoices(
                    { name: 'Créer', value: 'creer' },
                    { name: 'Supprimer', value: 'supp' },
                ),
        )
        .addStringOption(option =>
            option.setName('nom')
                .setDescription(`nom du profil`)
                .setAutocomplete(true)
                .setRequired(true)
        ),
    async execute(interaction) {
        const choix = interaction.options.getString('choix');
        const nom = interaction.options.getString('nom').toLowerCase();
        if (choix === "creer") {
            const lvl0 = `./data/profils/lvl0.json`;
            // File destination.txt will be created or overwritten by default.
            fs.copyFile(`./data/profils/lvl0.json`, `./data/profils/${nom}.json`, (err) => {
                if (err) throw err;
                //console.log('source.txt was copied to destination.txt');
            });
            interaction.reply(`Profil ${nom} crée`);
        }
        if (choix === "supp") {
            if (nom == "lvl0" || nom == "lvl5") {
                return interaction.reply(`Essaie encore pour voir!`);
            }
            const filePath = `./data/profils/${nom}.json`;
            fs.access(filePath, error => {
                if (!error) {
                    fs.unlink(filePath, function (error) {
                        if (error) console.error('Error Occured:', error);
                        console.log('File deleted!');
                    });
                } else {
                    console.error('Error Occured:', error);
                }
            });
            interaction.reply(`Profil ${nom} supprimé`);

        }
    },
};
