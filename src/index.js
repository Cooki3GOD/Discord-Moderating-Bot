import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent, // Ensure this is enabled in the Developer Portal
    ],
});

client.login(process.env.DISCORD_TOKEN);

client.once('ready', () => {
    console.log('Ready!');
});

client.on("messageCreate", async (message) => {
    console.log(message);

    if(!message.author.bot) {
        message.author.send(`Echo ${message.content}`);
    }
});