const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suppression')
        .setDescription('Supprime des messages vieux de plus de 30 jours.'),
    async execute(interaction) {
        // Récupère le channel à partir de son ID
        const channel = await interaction.client.channels.fetch('982791529108217866');
        interaction.reply({ content: "suppression en cours", ephemeral: true });
        // Récupère tous les messages du channel
        const messages = await channel.messages.fetch();

        // Récupère la date actuelle moins 30 jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Filtre les messages plus vieux que la date spécifiée
        const oldMessages = messages.filter(msg => msg.createdAt < thirtyDaysAgo);

        console.log(`Il y a ${oldMessages.size} messages vieux de plus de 30 jours dans le channel ${channel.name}`);

        // Supprime chaque message récupéré un par un
        oldMessages.reverse().forEach(async msg => {
            try {
                await msg.delete();
                console.log(`Le message ${msg.id} createdAt ${msg.createdAt} a été supprimé avec succès.`);
            } catch (error) {
                console.error(`Une erreur est survenue lors de la suppression du message ${msg.id}:`, error);
            }
        });
    },
};
