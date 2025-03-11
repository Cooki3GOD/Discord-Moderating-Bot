import { PermissionsBitField } from "discord.js";

export async function handleKickCommand(message) {
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