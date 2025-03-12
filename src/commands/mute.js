import { PermissionsBitField } from "discord.js";

const mutedMembers = new Map();

/**
 * Handles the mute command.
 * @param {Message} message - The message object.
 * @param {Array} args - The command arguments.
 */
export async function handleMuteCommand(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return message.reply('You do not have permission to mute members.');
    }

    const member = message.mentions.members.first();
    const duration = parseDuration(args[1]); // Parse the duration

    if (!member || duration === null) {
        return message.reply('Please mention a valid member to mute and provide a valid duration (e.g., 10m, 1h, 2d).');
    }

    if (mutedMembers.has(member.id)) {
        return message.reply(`${member.user.tag} is already muted.`);
    }

    try {
        await member.roles.add('MutedRoleID'); // Replace 'MutedRoleID' with the actual role ID for muted members
        mutedMembers.set(member.id, Date.now() + duration);

        message.channel.send(`${member.user.tag} has been muted for ${formatDuration(duration)}.`);

        setTimeout(async () => {
            if (mutedMembers.has(member.id) && Date.now() >= mutedMembers.get(member.id)) {
                await member.roles.remove('MutedRoleID'); // Replace 'MutedRoleID' with the actual role ID for muted members
                mutedMembers.delete(member.id);
                message.channel.send(`${member.user.tag} has been unmuted.`);
            }
        }, duration);
    } catch (error) {
        message.channel.send(`I cannot mute ${member.user.tag}.`);
        console.error(`Failed to mute ${member.user.tag}:`, error);
    }
}

/**
 * Parses a duration string (e.g., "10m", "1h", "2d") into milliseconds.
 * @param {string} durationStr - The duration string.
 * @returns {number|null} The duration in milliseconds, or null if invalid.
 */
function parseDuration(durationStr) {
    const match = durationStr.match(/^(\d+)([mhd])$/);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 'm': return value * 60000; // Minutes
        case 'h': return value * 3600000; // Hours
        case 'd': return value * 86400000; // Days
        default: return null;
    }
}

/**
 * Formats a duration in milliseconds into a human-readable string.
 * @param {number} duration - The duration in milliseconds.
 * @returns {string} The formatted duration string.
 */
function formatDuration(duration) {
    const minutes = Math.floor((duration / 60000) % 60);
    const hours = Math.floor((duration / 3600000) % 24);
    const days = Math.floor(duration / 86400000);

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;

    return result.trim();
}

/**
 * Handles the unmute command.
 * @param {Message} message - The message object.
 * @param {Array} args - The command arguments.
 */
export async function handleUnmuteCommand(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        return message.reply('You do not have permission to unmute members.');
    }

    const member = message.mentions.members.first();

    if (!member) {
        return message.reply('Please mention a valid member to unmute.');
    }

    if (!mutedMembers.has(member.id)) {
        return message.reply(`${member.user.tag} is not muted.`);
    }

    try {
        await member.roles.remove('MutedRoleID'); // Replace 'MutedRoleID' with the actual role ID for muted members
        mutedMembers.delete(member.id);
        message.channel.send(`${member.user.tag} has been unmuted.`);
    } catch (error) {
        message.channel.send(`I cannot unmute ${member.user.tag}.`);
        console.error(`Failed to unmute ${member.user.tag}:`, error);
    }
}