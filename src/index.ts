import { Client } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
});

client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag} 🐝`);
  // getProposals()
});

client.login(process.env.DISCORD_API_TOKEN);
