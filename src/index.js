import pkg from "discord.js";
import dotenv from "dotenv";
import * as commands from "./commands/index.js";

dotenv.config();

const { Client, GatewayIntentBits } = pkg;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(process.env.DISCORD_TOKEN);

client.once('ready', () => {
    console.log('Ready!');
});

const messageCounts = new Map();
const SPAM_THRESHOLD = 5;
const MESSAGE_TIME_FRAME = 10000;

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;
    if (!messageCounts.has(userId)) {
        messageCounts.set(userId, []);
    }

    const timestamps = messageCounts.get(userId);
    const now = Date.now();
    timestamps.push(now);

    while (timestamps.length > 0 && now - timestamps[0] > MESSAGE_TIME_FRAME) {
        timestamps.shift();
    }

    if (timestamps.length > SPAM_THRESHOLD) {
        await message.delete();
        return message.channel.send(`${message.author}, you are sending messages too quickly. Please slow down.`);
    }

    const discordLinkRegex = /discord\.gg\/\w+|discord\.com\/invite\/\w+/i;
    if (discordLinkRegex.test(message.content)) {
        await message.delete();
        return message.channel.send(`${message.author}, Discord links are not allowed.`);
    }

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();
    
    const inappropriateWords = ['nigger', 'nigga'];
    const inappropriateRegex = new RegExp(`\\b(${inappropriateWords.join('|')})\\b`, 'i');
    if (inappropriateRegex.test(message.content)) {
        await message.delete();
        return message.channel.send(`${message.author}, that word is not allowed.`);
    }

    const capsRegex = /[A-Z]{10,}/;
    if (capsRegex.test(message.content)) {
        const lowerCaseMessage = message.content.toLowerCase();
        await message.delete();
        return message.channel.send(`${message.author}, please do not use excessive capital letters. Here is your message in lowercase: ${lowerCaseMessage}`);
    }
    
    const commandHandlers = {
        '!help': commands.handleHelpCommand,
        '!kick': commands.handleKickCommand,
        '!ban': commands.handleBanCommand,
        '!tempban': commands.handleTempBanCommand,
        '!rules': commands.handleRulesCommand,
        '!warn': commands.handleWarnCommand,
        '!warnings': commands.handleWarningsCommand,
        '!clear': commands.handleClearCommand,
        '!roleadd': commands.handleRoleAddCommand,
        '!roleremove': commands.handleRoleRemoveCommand,
        '!mute': commands.handleMuteCommand,
        '!unmute': commands.handleUnmuteCommand,
        '!timeout': commands.handleTimeoutCommand,
    };

    if (commandHandlers[command]) {
        commandHandlers[command](message, args);
    }
});


const joinTimestamps = new Map();
const JOIN_THRESHOLD = 5;
const TIME_FRAME = 10000;
const RAID_ACTION = 'kick';

client.on('guildMemberAdd', async (member) => {
    const guildId = member.guild.id;
    if (!joinTimestamps.has(guildId)) {
        joinTimestamps.set(guildId, []);
    }

    const timestamps = joinTimestamps.get(guildId);
    const now = Date.now();
    timestamps.push(now);

    while (timestamps.length > 0 && now - timestamps[0] > TIME_FRAME) {
        timestamps.shift();
    }

    if (timestamps.length > JOIN_THRESHOLD) {
        if (RAID_ACTION === 'kick') {
            await member.kick('Raid detected');
        } else if (RAID_ACTION === 'ban') {
            await member.ban({ reason: 'Raid detected' });
        }

        const adminChannel = member.guild.channels.cache.find(channel => channel.name === 'admin-notifications');
        if (adminChannel) {
            adminChannel.send(`Potential raid detected. ${timestamps.length} users joined within ${TIME_FRAME / 1000} seconds.`);
        }
    }
});