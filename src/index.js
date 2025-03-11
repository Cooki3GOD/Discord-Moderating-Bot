const { Client, IntentsBitField } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.FLAGS.Guilds,
        IntentsBitField.FLAGS.GuildMessages,
        IntentsBitField.FLAGS.GuildMembers,
        intentsBitField.FLAGS.MessageContent,
        intentsBitField.FLAGS.MessageCreate,
    ],
})

client.login(DISCORD_TOKEN)