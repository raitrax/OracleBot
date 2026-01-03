const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Affiche la latence du bot et les statistiques'),
	async execute(interaction) {
		await interaction.deferReply();
		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;
		const wsPing = interaction.client.ws.ping;
		const uptime = process.uptime();
		const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

		const days = Math.floor(uptime / 86400);
		const hours = Math.floor(uptime / 3600) % 24;
		const minutes = Math.floor(uptime / 60) % 60;
		const seconds = Math.floor(uptime) % 60;

		const uptimeString = `${days}j ${hours}h ${minutes}m ${seconds}s`;

		interaction.editReply(
			`🏓 **Pong!**\n` +
			`📡 Latence API : **${ping}ms**\n` +
			`💓 Websocket : **${wsPing}ms**\n` +
			`⏱️ Uptime : **${uptimeString}**\n` +
			`💾 Mémoire : **${memoryUsage} MB**`
		);
	},
};
