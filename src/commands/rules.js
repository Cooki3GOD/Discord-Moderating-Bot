import { PermissionsBitField } from "discord.js";

export async function handleRulesCommand(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.reply('You do not have permission to view the rules.');
    }
    
    // PUT UR RULES HERE
    const rules = ` 
    1. Be respectful to others.
    2. No spamming or flooding the chat.
    3. No hate speech or offensive language.
    4. Follow the Discord Community Guidelines.
    5. Listen to the moderators and admins.
    `;
    message.channel.send(`Server rules: ${rules}`);
}