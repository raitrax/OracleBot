const {Command} = require('discord.js-commando')
const path = require('path');
const Database = require('better-sqlite3');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addreward',
			memberName: 'addreward',
			group: 'levels',
			aliases: ['addrecompense','addrécompense','addrewards'],
			description: 'Ajouter des récompenses en fonction des niveaux',
			examples: ['xp ajouter Raitrax 3000'],
			args: [
			{
				key: 'argument',
				prompt: 'Que souhaitez vous faire ? `ajouter`,`add`/`enlever`,`retirer`,`remove`',
				type: 'string',
				validate: v => (/(ajouter|add|enlever|retirer|remove|supprimer)/i).test(v) ? true : 'doit être une valeur valide, `ajouter`,`add`/`enlever`,`retirer`,`remove`,`supprimer`',
				parse: pf => pf.toLowerCase()
			},
			{
				key: 'level',
				prompt: 'Quel est le niveau cible ?',
				type: 'integer'
			},
			{
				key: 'role',
				prompt: 'Quel role est la récompense ?',
				type: 'role'
			}],
			userPermissions: ['ADMINISTRATOR']
		});
	}

	async run(msg, {argument,level,role}) {
		if(msg.guild.settings.get('levelSystem') === false) return msg.reply('impossible d\'ajouter des récompenses aux levels car ils ont été désactivés sur ce serveur.')
		const db = new Database(path.join(__dirname, '../../storage.sqlite'));
		if(argument === 'add' || argument === 'ajouter'){
			const result = db.prepare(`SELECT * FROM "rewards" WHERE role='${role.id}' AND level='${level}' AND guild='${msg.guild.id}'`).get()

			if (result) {
				return msg.reply(`La récompense \`${role.name}\` existe déjà pour le niveau \`${level}\` !`)
			}
			db.prepare(`INSERT INTO "rewards" (guild, role, level, date) VALUES ($guild, $role, $level, $date)`).run({
				guild: msg.guild.id, 
				role: role.id, 
				level, 
				date: new Date()
			})
			msg.reply('La récompense a bien été ajouté !')

		}else if(argument === 'remove' || argument === 'enlever' || argument === 'retirer' || argument === 'supprimer'){
			const result = db.prepare(`SELECT * FROM "rewards" WHERE role='${role.id}' AND guild='${msg.guild.id}'`).get()

			if (!result){
				return msg.reply(`Il n'y a pas de récompense pour le niveau \`${level}\` !`)  
			}
			db.prepare(`DELETE FROM "rewards" WHERE role='${role.id}' AND guild='${msg.guild.id}'`).run()
		}
	}
};