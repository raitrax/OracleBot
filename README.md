# 🤖 OracleBot

Bot Discord minimaliste avec système de commandes slash.

## 📋 Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- Un bot Discord créé sur le [Discord Developer Portal](https://discord.com/developers/applications)

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/OracleBot.git
cd OracleBot
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet :
```env
TOKEN=votre_token_bot_discord
CLIENT_ID=votre_client_id
GUILD_ID=votre_guild_id
```

Vous pouvez copier `.env.example` et le renommer en `.env`, puis remplacer les valeurs.

## ⚙️ Configuration

### Obtenir les identifiants Discord

1. **TOKEN** : Dans le Developer Portal, allez dans "Bot" → "Reset Token"
2. **CLIENT_ID** : Dans "General Information" → "Application ID"
3. **GUILD_ID** : Activez le mode développeur dans Discord, clic droit sur votre serveur → "Copier l'identifiant du serveur"

## 🎯 Déploiement des commandes

Avant de démarrer le bot, déployez les commandes slash sur Discord :

```bash
npm run deploy
```

Les commandes seront disponibles globalement après ~1 heure.

## 🏃 Démarrage

### Mode production
```bash
npm start
```

### Mode développement (avec auto-reload)
```bash
npm run dev
```

## 📚 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `/ping` | Affiche la latence du bot et les statistiques |

## 🛠️ Ajouter une nouvelle commande

1. Créez un fichier dans le dossier `commands/` :

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nom')
        .setDescription('Description de la commande'),
    async execute(interaction) {
        await interaction.reply('Réponse de la commande');
    },
};
```

2. Déployez les commandes :
```bash
npm run deploy
```

3. Redémarrez le bot

## 📁 Structure du projet

```
OracleBot/
├── commands/          # Commandes slash
│   └── ping.js
├── .env              # Variables d'environnement (ne pas commit)
├── .env.example      # Template des variables
├── deploy-commands.js # Script de déploiement
├── index.js          # Point d'entrée du bot
└── package.json      # Dépendances et scripts
```

## 🔒 Sécurité

- ⚠️ Ne commitez **jamais** le fichier `.env` (il contient votre token)
- Le fichier `.gitignore` est configuré pour ignorer `.env`
- Utilisez `.env.example` comme référence pour les autres développeurs

## 📦 Technologies utilisées

- [Discord.js](https://discord.js.org/) v14 - Bibliothèque Discord
- [dotenv](https://github.com/motdotla/dotenv) - Gestion des variables d'environnement
- [Node.js](https://nodejs.org/) - Runtime JavaScript

## 📝 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
