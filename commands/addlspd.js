const { SlashCommandBuilder } = require('@discordjs/builders');
const agent = './data/agentsLSPD.json';
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addlspd')
		.setDescription("ajout d'un membre LSPD")
		.addNumberOption(option => option.setName('matricule').setDescription("matricule de l'agent"))
		.addStringOption(option => option.setName('nom').setDescription("nom de l'agent"))
		.addStringOption(option => option.setName('number').setDescription("numéro de l'agent"))
		.addStringOption(option => option.setName('grade').setDescription("grade de l'agent")
		.addChoice("Cadet", "Cadet")
		.addChoice("Officier", "Officier")
		.addChoice("Officier Supérieur", "Officier Supérieur")
		.addChoice("Sergent", "Sergent")
		.addChoice("Sergent Chef", "Sergent Chef")
		.addChoice("Inspecteur", "Inspecteur")
		.addChoice("Lieutenant", "Lieutenant")
		.addChoice("Capitaine", "Capitaine")
		.addChoice("Commissaire", "Commissaire")),
	async execute(interaction) {
			const Matricule = interaction.options.getNumber('matricule');
			const Nom = interaction.options.getString('nom');
			const Number = interaction.options.getString('number');
			const Grade = interaction.options.getString('grade');
			/*console.log(Matricule);
			console.log(Nom);
			console.log(Number);
			console.log(Grade);*/
			var gradeID = 0;

			switch (Grade) {
				case "Commissaire":
					gradeID = 1;
					break;
				case "Capitaine":
					gradeID = 2;
					break;
				case "Lieutenant":
					gradeID = 3;
					break;
				case "Inspecteur":
					gradeID = 4;
					break;
				case "Sergent Chef":
					gradeID = 5;
					break;
				case "Sergent":
					gradeID = 6;
					break;
				case "Officier Supérieur":
					gradeID = 7;
					break;
				case "Officier":
					gradeID = 8;
					break;
				case "Cadet":
					gradeID = 9;
					break;
				default:
					gradeID = 9;
					break;
			}

				console.log("ajout LSPD");
				const Toto = "Non validée"; 

				var LSPD2 = {
					"matricule": Matricule,
					"nom": Nom,
					"number": Number,
					//"gradeid": gradeID,
					"grade": Grade
				};
				fs.readFile(agent, 'utf8', function readFileCallback(err, data){
					if (err){
						console.log("erreur catch1 " +err);
					} else {
					obj = JSON.parse(data); //now it's an object
					//console.log(obj);
					obj.table.push(LSPD2); //add some data
					var obj2 = trierLeLSPD(obj.table);
					console.log(JSON.stringify(obj2));
					json = JSON.stringify(obj); //convert it back to json
					console.log(json);
					fs.writeFile(agent, json, 'utf8', function(err){
						if (err){
							console.log("erreur catch2 " +err);
						}}
					); // write it back 
				}});

				console.log("Reply LSPD");
				return interaction.reply({content:`LSPD [${LSPD2.matricule}] ${LSPD2.nom} (${LSPD2.number}) ajouté au grade de ${LSPD2.grade}.`, ephemeral: true});
	},
};
function trierLeLSPD(lspdAgent) {
	var com = lspdAgent.filter(function (agent){ return agent.grade == "Commissaire"});
	var cap = lspdAgent.filter(function (agent){ return agent.grade == "Capitaine"});
	var ltn = lspdAgent.filter(function (agent){ return agent.grade == "Lieutenant"});
	var insp = lspdAgent.filter(function (agent){ return agent.grade == "Inspecteur"});
	var sgtchef = lspdAgent.filter(function (agent){ return agent.grade == "Sergent Chef"});
	var sgt = lspdAgent.filter(function (agent){ return agent.grade == "Sergent"});
	var offsup = lspdAgent.filter(function (agent){ return agent.grade == "Officier Supérieur"});
	var off = lspdAgent.filter(function (agent){ return agent.grade == "Officier"});
	var cad = lspdAgent.filter(function (agent){ return agent.grade == "Cadet"});
	var com2 = com.slice(0);
	com2.sort(function(a,b) { return a.matricule - b.matricule; });
	var cap2 = cap.slice(0);
	cap2.sort(function(a,b) { return a.matricule - b.matricule; });

	var ltn2 = ltn.slice(0);
	ltn2.sort(function(a,b) { return a.matricule - b.matricule; });

	var insp2 = insp.slice(0);
	insp2.sort(function(a,b) { return a.matricule - b.matricule; });

	var sgtchef2 = sgtchef.slice(0);
	sgtchef2.sort(function(a,b) { return a.matricule - b.matricule; });

	var sgt2 = sgt.slice(0);
	sgt2.sort(function(a,b) { return a.matricule - b.matricule; });
	
	var offsup2 = offsup.slice(0);
	offsup2.sort(function(a,b) { return a.matricule - b.matricule; });
	
	var off2 = off.slice(0);
	off2.sort(function(a,b) { return a.matricule - b.matricule; });
	
	var cad2 = cad.slice(0);
	cad2.sort(function(a,b) { return a.matricule - b.matricule; });

	var table = Object.assign(com2, cap2, ltn2, insp2, sgtchef2, sgt2, offsup2, off2, cad2 );

	console.log(table);
	console.log(com2);
	//table.push(com2);

	console.log(cap2);
	//table.push(cap2);

	console.log(ltn2);
	//table.push(ltn2);

	console.log(insp2);
	//table.push(insp2);

	console.log(sgtchef2);
	//table.push(sgtchef2);

	console.log(sgt2);
	//table.push(sgt2);

	console.log(offsup2);
	//table.push(offsup2);

	console.log(off2);
	//table.push(off2);

	console.log(cad2);
	//table.push(cad2);

  }