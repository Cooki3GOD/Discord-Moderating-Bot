import { PermissionsBitField } from "discord.js";

export async function handleTempBanCommand(message, args) {
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