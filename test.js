const schedule = require('node-schedule');

// Définir la règle pour planifier l'exécution de la fonction tous les mois
const rule = new schedule.RecurrenceRule();
rule.dayOfMonth = 1; // exécuter la tâche le 1er jour de chaque mois à minuit

// Fonction qui sera exécutée tous les mois
const addTwoToCounter = () => {
    // Code pour ajouter 2 à un compteur
    console.log('Ajouter 2 au compteur');
};

// Planifier l'exécution de la fonction avec la règle spécifiée
const job = schedule.scheduleJob(rule, addTwoToCounter);

