const fs = require('node:fs');
const path = require('node:path');

let config = {};
try {
	const raw = fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8');
	config = JSON.parse(raw);
} catch (error) {
	console.warn('⚠️  config.json introuvable ou invalide — fonctionnalités configurables désactivées.');
}

// Un ID Discord (snowflake) est une chaîne de chiffres. Sert à savoir si un
// champ est réellement renseigné (les placeholders vides sont ignorés).
const isId = (v) => typeof v === 'string' && /^\d{5,}$/.test(v);

module.exports = { config, isId };
