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
import { handleMuteCommand, handleUnmuteCommand } from "./commands/mute.js"; // Import the handleMuteCommand and handleUnmuteCommand function

// Load environment variables from a .env file
dotenv.config();

const { Client, GatewayIntentBits } = pkg;

// Initialize the Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent, // Required for message content checks
    ],
});

// Log in to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);

// Event listener for when the bot is ready
client.once('ready', () => {
    console.log('Ready!');
});


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
    
    // Check for the N-word
    const inappropriateWords = ['nigger', 'nigga'];
    const inappropriateRegex = new RegExp(`\\b(${inappropriateWords.join('|')})\\b`, 'i');
    if (inappropriateRegex.test(message.content)) {
        await message.delete();
        return message.channel.send(`${message.author}, that word is not allowed.`);
    }

    // Check for excessive caps
    const capsRegex = /[A-Z]{10,}/;
    if (capsRegex.test(message.content)) {
        const lowerCaseMessage = message.content.toLowerCase();
        await message.delete();
        return message.channel.send(`${message.author}, please do not use excessive capital letters. Here is your message in lowercase: ${lowerCaseMessage}`);
    }
    
    // Handle commands
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
        case '!mute':
            handleMuteCommand(message, args);
            break;
        case '!unmute':
            handleUnmuteCommand(message);
            break
        default:
            break;
    }
});