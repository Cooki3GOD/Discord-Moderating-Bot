import { PermissionsBitField } from "discord.js";

export async function handleClearCommand(message, args) {
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