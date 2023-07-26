const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// Send a deferred reply
		await interaction.deferReply();
		const reply = await interaction.fetchReply();
		// Get the ping time
		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		// Get the websocket ping time
		const websocketPingTime = interaction.client.ws.ping;

		// Send a reply with the ping and websocket ping times
		interaction.editReply(`Ping: ${ping}ms\nWebsocket Ping: ${websocketPingTime}ms`);
	},
};
