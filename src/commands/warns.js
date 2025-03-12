import { PermissionsBitField } from "discord.js";

const warnings = new Map();

/**
 * Handles the warn command.
 * @param {Message} message - The message object.
 * @param {Array} args - The command arguments.
 */
export async function handleWarnCommand(message, args) {
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

    warnings.get(member.id).push({
        reason: reason,
        date: new Date().toISOString(),
        warnedBy: message.author.tag
    });
    const warningCount = warnings.get(member.id).length;

    message.channel.send(`${member.user.tag} has been warned. Reason: ${reason}. This is warning #${warningCount}.`);

    // Take action if the user reaches 3 warnings
    if (warningCount >= 3) {
        try {
            await member.kick();
            message.channel.send(`${member.user.tag} has been kicked due to receiving 3 warnings.`);
        } catch (error) {
            message.channel.send(`I cannot kick ${member.user.tag}.`);
            console.error(`Failed to kick ${member.user.tag}:`, error);
        }
    }
}

/**
 * Handles the warnings command.
 * @param {Message} message - The message object.
 */
export async function handleWarningsCommand(message) {
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
    const formattedWarnings = userWarnings.map(warning => {
        const { reason, date, warnedBy } = warning;
        return `Reason: ${reason}, Date: ${date}, Warned by: ${warnedBy}`;
    });

    message.channel.send(`${member.user.tag} has the following warnings:\n${formattedWarnings.join('\n')}`);
}