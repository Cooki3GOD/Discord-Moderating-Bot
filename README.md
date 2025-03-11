# Discord Moderating Bot

## Overview
Discord Moderating Bot is a powerful and efficient bot designed to help moderate and manage your Discord server. It offers various features such as kicking, banning, temporary banning, warning, and managing roles for users.

## Features
- Kick users
- Ban users
- Temporarily ban users
- Warn users
- Display user warnings
- Clear messages in bulk
- Add roles to users
- Remove roles from users
- Spam detection
- Discord link detection

## Requirements
- Node.js v14 or higher
- npm

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Cooki3GOD/Discord-Moderating-Bot.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Discord-Moderating-Bot
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Configuration
1. Create a `.env` file in the root directory.
2. Add your bot token to the `.env` file:
    ```
    DISCORD_TOKEN=your_bot_token_here
    ```

## Running the Bot
To start the bot, run the following command:
```bash
npm start
```

## Commands
- `!help` - Display available commands
- `!kick @user` - Kick a user
- `!ban @user` - Ban a user
- `!tempban @user duration` - Temporarily ban a user for a specified duration (in minutes)
- `!rules` - Display the server rules
- `!warn @user reason` - Warn a user with a specified reason
- `!warnings @user` - Display warnings for a user
- `!clear number` - Clear a specified number of messages from the channel
- `!roleadd @user <role>` - Add a role to a user
- `!roleremove @user <role>` - Remove a role from a user

## Event Listeners
- `ready` - Triggered when the bot is ready
- `messageCreate` - Triggered when a new message is created in the server

## License
This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Support
If you have any issues or questions, please open an issue on the [GitHub repository](https://github.com/Cooki3GOD/Discord-Moderating-Bot/issues).

## Acknowledgements
- [discord.js](https://discord.js.org/) - A powerful JavaScript library for interacting with the Discord API
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a `.env` file
- [nodemon](https://www.npmjs.com/package/nodemon) - A tool that helps develop node.js applications by automatically restarting the node application when file changes are detected
