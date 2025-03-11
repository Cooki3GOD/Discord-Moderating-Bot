import { PermissionsBitField } from "discord.js";

// Handle the !roleAdd command
export async function handleRoleAddCommand(message, args) {
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

// Handle the !roleRemove command
export async function handleRoleRemoveCommand(message, args) {
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
        await member.roles.remove(role);
        message.channel.send(`${member.user.tag} has been removed from the role ${role.name}.`);
    } catch (error) {
        message.channel.send(`I cannot remove the role ${role.name} from ${member.user.tag}.`);
        console.error(error);
    }
}