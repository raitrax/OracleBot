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
            const rawdatatalents = fs.readFileSync(lvl0);
            let objdatatalents = JSON.parse(rawdatatalents);

            objdatatalents.Nom = nom;
            objdatatalents.Owner = interaction.member.id;

            fs.writeFileSync(`./data/profils/${nom}.json`, JSON.stringify(objdatatalents));
            interaction.reply({ content: `Profil ${nom} crée`, ephemeral: true });
        }
        if (choix === "supp") {
            if (nom == "lvl0" || nom == "lvl1" || nom == "lvl2" || nom == "lvl3" || nom == "lvl4" || nom == "lvl5") {
                return interaction.reply({ content: `Essaie encore pour voir!`, ephemeral: true });
            }
            const lvl0 = `./data/profils/${nom}.json`;
            const rawdatatalents = fs.readFileSync(lvl0);
            let objdatatalents = JSON.parse(rawdatatalents);
            if (objdatatalents.Owner != interaction.member.id) {
                return interaction.reply({ content: `T'es pas le proprio, tu peux arrêter d'essayer! :)`, ephemeral: true });
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
            interaction.reply({ content: `Profil ${nom} supprimé`, ephemeral: true });

        }
    },
};
