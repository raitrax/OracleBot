const { Command } = require('discord.js-commando');
//const { RichEmbed } = require('discord.js');
const {MessageEmbed} = require('discord.js');

const fs = require("fs");

module.exports = class LoadoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loadout',
            group: 'dcuo',
            memberName: 'loadout',
            description: 'loadout des pouvoirs demandé.',
            examples: ['loadout'],
            args: [
              {
                key: 'pouvoir',
                prompt: 'nom pouvoir',
                type: 'string',
                default : ''
              },
              {
                key: 'role',
                prompt: 'nom role',
                type: 'string',
                default : ''
              }
            ]
        });
    }

    run(msg, { pouvoir, role }) {
      var loadout = JSON.parse(fs.readFileSync("./data/loadout.json", "utf8"));
      var specification = JSON.parse(fs.readFileSync("./data/specification.json", "utf8"));
      var spec;
      var loadoutpouvoir;
      var loadoutpouvoirrole;
      //console.log(loadout);
      if (!pouvoir) {
        for (var x in loadout) {
          //console.log(loadout[x].NomPouvoir);
        }
        return msg.say("donne le nom d'un pouvoir")
      }
      else {
        for (var x in loadout) {
          if (loadout[x].NomPouvoir === pouvoir) {
            loadoutpouvoir = loadout[x].Role;
          }
        }
        //console.log(loadoutpouvoir);
        if (!loadoutpouvoir) {
          //console.log("mauvais nom de pouvoir");
          return msg.say("mauvais nom de pouvoir")
        }
        else {
          if (!role) {
            //console.log("je dois tout afficher du role");
            //loadoutpouvoirrole = loadoutpouvoir.Loadout;
            //console.log(loadoutpouvoir);
            for (var x in loadoutpouvoir) {
              //console.log(loadoutpouvoir[x].NomRole);
              //console.log(loadoutpouvoir[x].Loadout);
              loadoutpouvoirrole = loadoutpouvoir[x].Loadout;
              for (var y in loadoutpouvoirrole) {
                for (var y in specification) {
                  if (specification[y].Nom === loadoutpouvoirrole[x].Repartition) {
                    spec = specification[x].Spec;
                  }
                }
                //const embed = new RichEmbed()
                const embed = new MessageEmbed()
                .setTitle(pouvoir + ' ' + loadoutpouvoir[x].NomRole)
                //.setAuthor(msg.author.username, msg.author.displayAvatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                //.setDescription("Pour plus de détails sur le pouvoir via DCUOBLOGUIDE, [Clique ICI](http://census.dcuobloguide.com/character/stats/" + character_list.character_id + ")")
                //.setThumbnail("http://census.daybreakgames.com/files/dcuo/images/character/paperdoll/"+ character_list.character_id )
                .addField("Version", loadoutpouvoirrole[y].Version)
                .addField("Pouvoir1", loadoutpouvoirrole[y].Pouvoir1, true)
                .addField("Pouvoir2", loadoutpouvoirrole[y].Pouvoir2, true)
                .addField("Pouvoir3", loadoutpouvoirrole[y].Pouvoir3, true)
                .addField("Pouvoir4", loadoutpouvoirrole[y].Pouvoir4, true)
                .addField("Pouvoir5", loadoutpouvoirrole[y].Pouvoir5, true)
                .addField("Pouvoir6", loadoutpouvoirrole[y].Pouvoir6, true)
                .addField("Rotation", loadoutpouvoirrole[y].Rotation)
                .addField("Repartition", spec)

                .setImage(loadoutpouvoirrole[y].Image)
                .setFooter("Demandé par " + msg.author.username , msg.author.avatarURL);

                msg.embed(embed);
              }
            }
            return null;
          }
          else {
            for (var x in loadoutpouvoir) {
              //console.log(loadoutpouvoir[x].NomRole);
              if (loadoutpouvoir[x].NomRole === role) {
                loadoutpouvoirrole = loadoutpouvoir[x].Loadout;
              }
            }
            if (!loadoutpouvoirrole) {
              //console.log("mauvais nom de role");
              return msg.say("mauvais nom de role")
            }
            else {
              for (var x in loadoutpouvoirrole) {
                for (var y in specification) {
                  if (specification[y].Nom === loadoutpouvoirrole[x].Repartition) {
                    spec = specification[x].Spec;
                  }
                }
                //const embed = new RichEmbed()
                const embed = new MessageEmbed()
                .setTitle(pouvoir + ' ' + role)
                //.setAuthor(msg.author.username, msg.author.displayAvatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                //.setDescription("Pour plus de détails sur le pouvoir via DCUOBLOGUIDE, [Clique ICI](http://census.dcuobloguide.com/character/stats/" + character_list.character_id + ")")
                //.setThumbnail("http://census.daybreakgames.com/files/dcuo/images/character/paperdoll/"+ character_list.character_id )
                .addField("Version", loadoutpouvoirrole[x].Version)
                .addField("Pouvoir1", loadoutpouvoirrole[x].Pouvoir1, true)
                .addField("Pouvoir2", loadoutpouvoirrole[x].Pouvoir2, true)
                .addField("Pouvoir3", loadoutpouvoirrole[x].Pouvoir3, true)
                .addField("Pouvoir4", loadoutpouvoirrole[x].Pouvoir4, true)
                .addField("Pouvoir5", loadoutpouvoirrole[x].Pouvoir5, true)
                .addField("Pouvoir6", loadoutpouvoirrole[x].Pouvoir6, true)
                .addField("Rotation", loadoutpouvoirrole[x].Rotation)
                .addField("Repartition", spec)
                .setImage(loadoutpouvoirrole[x].Image)
                .setFooter("Demandé par " + msg.author.username , msg.author.avatarURL);

                msg.embed(embed);
              }
            }
            return null;
          }
        }
      }
    }
};
