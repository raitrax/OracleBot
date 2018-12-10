const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js')

module.exports = class AvatarCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lmgtfy',
      memberName: 'lmgtfy',
      group: 'utils',
      aliases: ['google','search','recherche'],
      description: 'Permet d\'envoyer un lien lmgtfy.',
      examples: ['lmgtfy @Raitrax Comment trouver des réponses soit même'],
      args: [
        {
          key: 'member',
          prompt: 'Qui voulez vous notifier ?',
          type: 'member'
        },
        {
          key: 'search',
          prompt: 'Quelle recherche voulez vous ?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, {member, search}) {

    msg.delete()

    const question = search.split(' ').filter(val => val !== '').join('+');

    const embed = new MessageEmbed()
      .setColor('#cd6e57')
      .setTitle(member.user.username)
      .setURL(`https://www.lmgtfy.com/?q=${question}`)
      .setDescription(`Hey ${member.user}, clique  [ici](https://www.lmgtfy.com/?q=${question}), c'est de la part de ${msg.author}, il pense que celà pourrais t'aider !`);

    return msg.embed(embed);
  }
};