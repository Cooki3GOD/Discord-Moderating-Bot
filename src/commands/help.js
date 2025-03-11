export function handleHelpCommand(message) {
    message.channel.send(
        'Available commands:\n' +
        '!kick @user - Kick a user\n' +
        '!ban @user - Ban a user\n' +
        '!tempban @user duration - Temporarily ban a user for a specified duration (in minutes)\n' +
        '!rules - Display the server rules\n' +
        '!warn @user reason - Warn a user with a specified reason\n' +
        '!warnings @user - Display warnings for a user\n' +
        '!clear number - Clear a specified number of messages from the channel\n' +
        '!roleadd @user <role> - Add a role to a user\n' +
        '!roleremove @user <role> - Remove a role from a user'
    );
}