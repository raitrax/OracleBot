# OracleBot - Guide pour Agents IA

## Vue d'ensemble du projet
Bot Discord minimaliste avec système de commandes slash. Stack: Discord.js v14, Node.js.

## Architecture

### Structure de base
- **index.js** : Point d'entrée, gestion des événements Discord et commandes
- **commands/** : Commandes slash Discord (chargement automatique des fichiers .js)
- **deploy-commands.js** : Déploiement des commandes slash via l'API Discord

### Flux de données critique
1. Au démarrage (`ClientReady`), le bot charge les commandes depuis `commands/` via `fs.readdirSync`
2. Les commandes slash sont enregistrées globalement via `deploy-commands.js`
3. L'événement `InteractionCreate` route les commandes vers leur handler respectif

## Conventions du projet

### Structure des commandes
Toutes les commandes suivent ce pattern :
```javascript
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nom')
    .setDescription('Description en français'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    // Logique métier
  }
};
```

### Gestion des permissions
Si besoin de restreindre l'accès aux commandes, utiliser `member.roles.cache.has(roleID)` avec un ID de rôle

## Workflows développeur

### Déploiement des commandes
Après modification dans `commands/`, exécuter :
```powershell
node deploy-commands.js
```
Ceci enregistre les commandes globalement (`Routes.applicationCommands`) - changements visibles après ~1h.

### Configuration
**Ne jamais commiter `.env`** (contient le token). Utiliser `.env.example` comme référence. Variables essentielles :
- `TOKEN` : Token du bot Discord
- `CLIENT_ID` : ID de l'application Discord
- `GUILD_ID` : ID du serveur Discord pour les tests

Les variables d'environnement sont chargées via `dotenv`.

## Particularités techniques

### Intents Discord requis
```javascript
intents: [GatewayIntentBits.Guilds]
```
Nécessaire pour l'accès basique aux guildes et commandes slash.

## Points d'attention

- **Langue** : Toutes les descriptions/messages sont en **français** (parfois bilingue FR/EN)
- **Ephemeral replies** : Par défaut, utiliser `{ ephemeral: true }` pour les retours de commandes
- **Pas de tests** : Aucune suite de tests présente - tester manuellement via Discord
