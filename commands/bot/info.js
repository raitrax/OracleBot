const {MessageEmbed} = require('discord.js'), 
  {Command} = require('discord.js-commando')

module.exports = class InviteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      memberName: 'info',
      group: 'bot',
      aliases: ['infos', 'liens'],
      description: 'Afficher quelques liens importants pour le bot discord',
      examples: ['info'],
      guildOnly: false
    });
  }

  run (msg) {
    const infoEmbed = new MessageEmbed()
    .setTitle("Informations")
    .setDescription("Voici quelques informations concernant")
    .setColor(0xcd6e57)
    .setFooter("DraftMan | Développeur FrontEnd & Graphiste", "https://www.draftman.fr/images/avatar.jpg")
    .addField("Lib du bot", "[discord.js](https://discord.js.org)", true)
    .addField("Website", "[draftman.fr](https://www.draftman.fr/)", true)
    .addField("DiscordBots", "[discordbots.org/draftbot](https://discordbots.org/bot/318312854816161792)", true)
    .addField("Support", "[draftman.fr/discord](https://www.draftman.fr/discord)", true)
    .addField("Twitter", "[twitter.com/DraftMan_Dev](https://twitter.com/DraftMan_Dev)", true)
    .addField("Développeur", "Raitrax#8360", true)
    .setTimestamp()

    return msg.embed(infoEmbed);
  }
};