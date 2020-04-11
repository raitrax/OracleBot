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
    var test = this.client.users.get("182517037795377153")
    console.log(test.avatarURL());
    const infoEmbed = new MessageEmbed()
    .setTitle("Informations")
    .setDescription("Voici quelques informations concernant")
    .setColor(0xcd6e57)
    //.setFooter("Raitrax | Développeur C#", "https://www.draftman.fr/images/avatar.jpg")
    .setFooter("Raitrax | Développeur C#", test.avatarURL())
    .addField("Lib du bot", "[discord.js](https://discord.js.org)", true)
    //.addField("DiscordBots", "[discordbots.org/draftbot](https://discordbots.org/bot/318312854816161792)", true)
    .addField("Développeur", "Raitrax#8360", true)
    .setTimestamp()

    return msg.embed(infoEmbed);
  }
};