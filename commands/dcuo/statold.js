const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require("snekfetch");

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'statold',
      group: 'dcuo',
      memberName: 'statold',
      description: 'Affiche les stats d\'un joueur de DCUO sur le serveur EUPC/PS.',
      examples: ['statold'],
      args: [
        {
          key: 'name1',
          prompt: 'premier nom',
          type: 'string',
          default : ''
        },
        {
          key: 'name2',
          prompt: 'deuxième nom',
          type: 'string',
          default : ''
        }
      ]
    });
  }

  run(msg, { name1, name2 }) {
    var name = "";
    if (!name1) {
      return msg.say("Spécifie un pseudo. Ex: badbay973 Ex: Aretix Gaming")
    }
    else {
      if (!name2) {
        name = name1
      }
      else {
        name = name1 + " " + name2
      }
    }
    this.client.user.setActivity('les stats de '+ name, { type: 'WATCHING' })
    var ligue;
    var region;
    var pouvoir;
    var respouvoir;
    var resligueid;
    var resligue;

    var urlcharacter = "http://census.daybreakgames.com/s:CyborgApp/get/dcuo/character?name=*"+ name + "&world_id=4&deleted=false&c:case=false&c:limit=1&c:exactMatchFirst=true";
    //var urlcharacter = "http://census.daybreakgames.com/s:CyborgApp/get/dcuo/character?name=*Cyborg¬&world_id=4&deleted=false&c:case=false&c:limit=1&c:exactMatchFirst=true";
    var rescharacter = encodeURI(urlcharacter);
    snekfetch.get(rescharacter).then(r => {
      if (r.body.returned === 0) {
        return msg.say("ce perso n'existe pas");
      }
      let body = r.body;
      for (var i = 0; i < body.character_list.length; i++) {
        var character_list = body.character_list[i];
        var charactername = character_list.name;
        var combat_rating = character_list.combat_rating;
        var skill_points = character_list.skill_points;
        var pvp_combat_rating = character_list.pvp_combat_rating;
        var max_health = character_list.max_health;
        var max_power = character_list.max_power;
        var defense = character_list.defense;
        var toughness = character_list.toughness;
        var might = character_list.might;
        var precision = character_list.precision;
        var restoration = character_list.restoration;
        var vitalization = character_list.vitalization;
        var dominance = character_list.dominance;
      }
      var urlpouvoir = "https://census.daybreakgames.com/s:CyborgApp/json/get/dcuo/power_type/" + character_list.power_type_id;
      respouvoir = encodeURI(urlpouvoir);
      console.log('respouvoir1 : ', respouvoir);

    });
    console.log('respouvoir : ', respouvoir);

    snekfetch.get(respouvoir).then(r => {
      let body = r.body;
      if (r.body.returned === 0) {
        pouvoir = "eau";
      }
      else {
        for (var i = 0; i < body.power_type_list.length; i++) {
          var power_type_list = body.power_type_list[i];
          pouvoir = power_type_list.name.fr;
        }
      }
      var urlligueid = "https://census.daybreakgames.com/s:CyborgApp/get/dcuo/guild_roster?character_id=" + character_list.character_id;
      resligueid = encodeURI(urlligueid);
    });
    snekfetch.get(resligueid).then(r => {
      let body = r.body;
      if (r.body.returned === 0) {
        var ligue = "n'a pas de ligue";
      }
      else {
        for (var i = 0; i < body.guild_roster_list.length; i++) {
          var guild_roster_list = body.guild_roster_list[i];
        }

        var urlligue = "https://census.daybreakgames.com/s:CyborgApp/get/dcuo/guild?guild_id=" + guild_roster_list.guild_id;
        resligue = encodeURI(urlligue);
      }
    });
    snekfetch.get(resligue).then(r => {
      let body = r.body;
      if (r.body.returned === 0) {
        ligue = "n'a pas de ligue";
      }
      else {
        for (var i = 0; i < body.guild_list.length; i++) {
          var guild_list = body.guild_list[i];
          ligue = guild_list.name;
        }
      }
    });
    console.log("region : "+ region);
    console.log(charactername);
    console.log(combat_rating);
    console.log(pvp_combat_rating);
    console.log(skill_points);
    console.log(pouvoir);
    console.log(ligue);
    console.log(region);
    var Resistance = "Santé : " + max_health + "\nPouvoir : " + max_power + "\nDéfense : " + defense + "\nEndurance : " + toughness;
    var Action = "Puissance : " + might + "\nPrécision : " + precision + "\nVitalisation : " + vitalization + "\nRestauration : " + restoration + "\nDominance : " + dominance;
    const embed = new RichEmbed()
    .setTitle(charactername)
    //.setAuthor(msg.author.username, msg.author.displayAvatarURL)
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription("Pour plus de détails sur le joueur via DCUOBLOGUIDE, [Clique ICI](http://census.dcuobloguide.com/character/stats/" + character_list.character_id + ")")
    .setThumbnail("http://census.daybreakgames.com/files/dcuo/images/character/paperdoll/"+ character_list.character_id )
    .addField("CR", combat_rating, true)
    .addField("SP", skill_points, true)
    .addField("PVP", pvp_combat_rating, true)
    .addField("Pouvoir", pouvoir, true)
    .addField("Ligue", ligue)
    .addField("Resistance", Resistance, true)
    .addField("Action", Action, true)
    .setFooter("Demandé par " + msg.author.username , msg.author.avatarURL);

    return msg.embed(embed);
  }
};
