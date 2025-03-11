import { PermissionsBitField } from "discord.js";

export async function handleBanCommand(message) {
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