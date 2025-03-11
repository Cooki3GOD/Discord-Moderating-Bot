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
    if (message.author.bot) return;

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
        default:
            break;
    }
});

function handleHelpCommand(message) {
    message.channel.send(
        'Available commands:\n' +
        '!kick @user - Kick a user\n' +
        '!ban @user - Ban a user\n' +
        '!tempban @user duration - Temporarily ban a user for a specified duration (in minutes)'
    );
}

async function handleKickCommand(message) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
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

async function handleBanCommand(message) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
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

async function handleTempBanCommand(message, args) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
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