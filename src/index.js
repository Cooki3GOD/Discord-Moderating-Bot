import pkg from "discord.js";
import dotenv from "dotenv";

// Import the command handlers
import { handleHelpCommand } from "./commands/help.js"; // Import the handleHelpCommand function
import { handleKickCommand } from "./commands/kick.js"; // Import the handleKickCommand function
import { handleBanCommand } from "./commands/ban.js"; // Import the handleBanCommand function
import { handleTempBanCommand } from "./commands/tempban.js"; // Import the handleTempBanCommand function
import { handleRulesCommand } from "./commands/rules.js"; // Import the handleRulesCommand function
import { handleWarnCommand, handleWarningsCommand } from "./commands/warns.js"; // Import the handleWarnCommand and handleWarningsCommand functions
import { handleClearCommand } from "./commands/clear.js"; // Import the handleClearCommand function
import { handleRoleAddCommand, handleRoleRemoveCommand } from "./commands/roles.js"; // Import the handleRoleAddCommand and handleRoleRemoveCommand functions

// Load environment variables from a .env file
dotenv.config();

const { Client, GatewayIntentBits, PermissionsBitField } = pkg;

// Initialize the Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent, // Ensure this is enabled in the Developer Portal
    ],
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);

// Event listener for when the bot is ready
client.once('ready', () => {
    console.log('Ready!');
});

// Data structure to store warnings and message counts
const warnings = new Map();
const messageCounts = new Map();
const SPAM_THRESHOLD = 5; // Number of messages allowed within the time frame
const TIME_FRAME = 10000; // Time frame in milliseconds (10 seconds)

// Event listener for message creation
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Check for spam
    const userId = message.author.id;
    if (!messageCounts.has(userId)) {
        messageCounts.set(userId, []);
    }

    const timestamps = messageCounts.get(userId);
    const now = Date.now();
    timestamps.push(now);

    // Remove timestamps older than the time frame
    while (timestamps.length > 0 && now - timestamps[0] > TIME_FRAME) {
        timestamps.shift();
    }

    if (timestamps.length > SPAM_THRESHOLD) {
        await message.delete();
        return message.channel.send(`${message.author}, you are sending messages too quickly. Please slow down.`);
    }

    // Check for Discord links
    const discordLinkRegex = /discord\.gg\/\w+|discord\.com\/invite\/\w+/i;
    if (discordLinkRegex.test(message.content)) {
        await message.delete();
        return message.channel.send(`${message.author}, Discord links are not allowed.`);
    }

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case '!help':
            handleHelpCommand(message);
            break;
        case '!kick':
            handleKickCommand(message);
            break;
        case '!ban':
            handleBanCommand(message);
            break;
        case '!tempban':
            handleTempBanCommand(message, args);
            break;
        case '!rules':
            handleRulesCommand(message);
            break;
        case '!warn':
            handleWarnCommand(message, args);
            break;
        case '!warnings':
            handleWarningsCommand(message);
            break;
        case '!clear':
            handleClearCommand(message, args);
            break;
        case '!roleadd':
            handleRoleAddCommand(message, args);
            break;
        case '!roleremove':
            handleRoleRemoveCommand(message, args);
            break;
        default:
            break;
    }
});

// Remove the existing handleHelpCommand function from here

// Remove the existing handleKickCommand function from here

// Remove the existing handleBanCommand function from here

// Remove the existing handleTempBanCommand function from here

// Remove the existing handleRulesCommand function from here

// Remove the existing handleWarnCommand function from here and HandleWarningsCommand function from here

// Remove the existing handleClearCommand function from here

// Remove the existing handleRoleAddCommand function from here and handleRoleRemoveCommand function from here