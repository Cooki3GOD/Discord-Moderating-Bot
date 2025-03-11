import pkg from "discord.js";
import dotenv from "dotenv";
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
        default:
            break;
    }
});

// Handle the !help command
function handleHelpCommand(message) {
    message.channel.send(
        'Available commands:\n' +
        '!kick @user - Kick a user\n' +
        '!ban @user - Ban a user\n' +
        '!tempban @user duration - Temporarily ban a user for a specified duration (in minutes)\n' +
        '!rules - Display the server rules\n' +
        '!warn @user reason - Warn a user with a specified reason\n' +
        '!warnings @user - Display warnings for a user\n' +
        '!clear number - Clear a specified number of messages from the channel\n' +
        '!roleadd @user <role> - Add a role to a user'
    );
}

// Handle the !kick command
async function handleKickCommand(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return message.reply('You do not have permission to kick members.');
    }

    const member = message.mentions.members.first();
    if (!member) {
        return message.reply('Please mention a valid member to kick.');
    }

    try {
        await member.kick();
        message.channel.send(`${member.user.tag} has been kicked.`);
    } catch (error) {
        message.channel.send(`I cannot kick ${member.user.tag}.`);
        console.error(error);
    }
}

// Handle the !ban command
async function handleBanCommand(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply('You do not have permission to ban members.');
    }

    const member = message.mentions.members.first();
    if (!member) {
        return message.reply('Please mention a valid member to ban.');
    }

    try {
        await member.ban();
        message.channel.send(`${member.user.tag} has been banned.`);
    } catch (error) {
        message.channel.send(`I cannot ban ${member.user.tag}.`);
        console.error(error);
    }
}

// Handle the !tempban command
async function handleTempBanCommand(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply('You do not have permission to ban members.');
    }

    const member = message.mentions.members.first();
    const duration = parseInt(args[0], 10);

    if (!member || isNaN(duration)) {
        return message.reply('Please mention a valid member to ban and specify a valid duration in minutes.');
    }

    try {
        await member.ban();
        message.channel.send(`${member.user.tag} has been temporarily banned for ${duration} minutes.`);

        setTimeout(async () => {
            try {
                await message.guild.members.unban(member.id);
                message.channel.send(`${member.user.tag} has been unbanned.`);
            } catch (error) {
                console.error(`Failed to unban ${member.user.tag}:`, error);
            }
        }, duration * 60 * 1000); // Convert minutes to milliseconds
    } catch (error) {
        message.channel.send(`I cannot ban ${member.user.tag}.`);
        console.error(error);
    }
}

// Handle the !rules command
async function handleRulesCommand(message) {
    message.channel.send('Server rules: ...');
}

// Handle the !warn command
async function handleWarnCommand(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return message.reply('You do not have permission to warn members.');
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member || !reason) {
        return message.reply('Please mention a valid member to warn and provide a reason.');
    }

    if (!warnings.has(member.id)) {
        warnings.set(member.id, []);
    }

    warnings.get(member.id).push(reason);
    const warningCount = warnings.get(member.id).length;

    message.channel.send(`${member.user.tag} has been warned. Reason: ${reason}. This is warning #${warningCount}.`);

    // Take action if the user reaches 3 warnings
    if (warningCount >= 3) {
        try {
            await member.kick();
            message.channel.send(`${member.user.tag} has been kicked due to receiving 3 warnings.`);
        } catch (error) {
            message.channel.send(`I cannot kick ${member.user.tag}.`);
            console.error(error);
        }
    }
}

// Handle the !warnings command
async function handleWarningsCommand(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return message.reply('You do not have permission to view warnings.');
    }

    const member = message.mentions.members.first();
    if (!member) {
        return message.reply('Please mention a valid member to view warnings.');
    }

    if (!warnings.has(member.id)) {
        return message.reply(`${member.user.tag} has no warnings.`);
    }

    const userWarnings = warnings.get(member.id);
    message.channel.send(`${member.user.tag} has the following warnings:\n${userWarnings.join('\n')}`);
}

// Handle the !clear command
async function handleClearCommand(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply('You do not have permission to manage messages.');
    }

    const amount = parseInt(args[0], 10);
    if (isNaN(amount) || amount <= 0) {
        return message.reply('Please specify a valid number of messages to clear.');
    }

    try {
        await message.channel.bulkDelete(amount, true);
        message.channel.send(`Cleared ${amount} messages.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    } catch (error) {
        message.channel.send('There was an error trying to clear messages in this channel.');
        console.error(error);
    }
}

// Handle the !roleAdd command
async function handleRoleAddCommand(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return message.reply('You do not have permission to manage roles.');
    }

    const member = message.mentions.members.first();
    const roleName = args.slice(1).join(' ');

    if (!member || !roleName) {
        return message.reply('Please mention a valid member and specify a role.');
    }

    const role = message.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
        return message.reply('Role not found.');
    }

    try {
        await member.roles.add(role);
        message.channel.send(`${member.user.tag} has been given the role ${role.name}.`);
    } catch (error) {
        message.channel.send(`I cannot add the role ${role.name} to ${member.user.tag}.`);
        console.error(error);
    }
}