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

    if (!message.author.bot) {
        const args = message.content.split(' ');
        const command = args.shift().toLowerCase();

        if (command === '!kick') {
            if (!message.member.permissions.has('KICK_MEMBERS')) {
                return message.reply('You do not have permission to kick members.');
            }

            const member = message.mentions.members.first();
            if (member) {
                try {
                    await member.kick();
                    message.channel.send(`${member.user.tag} has been kicked.`);
                } catch (error) {
                    message.channel.send(`I cannot kick ${member.user.tag}.`);
                    console.error(error);
                }
            } else {
                message.reply('Please mention a valid member to kick.');
            }
        }

        if (command === '!ban') {
            if (!message.member.permissions.has('BAN_MEMBERS')) {
                return message.reply('You do not have permission to ban members.');
            }

            const member = message.mentions.members.first();
            if (member) {
                try {
                    await member.ban();
                    message.channel.send(`${member.user.tag} has been banned.`);
                } catch (error) {
                    message.channel.send(`I cannot ban ${member.user.tag}.`);
                    console.error(error);
                }
            } else {
                message.reply('Please mention a valid member to ban.');
            }
        }

        // Commented out the DM sending part
        // try {
        //     await message.author.send(`Echo ${message.content}`);
        // } catch (error) {
        //     console.error(`Could not send message to ${message.author.tag}:`, error);
        // }
    }
});