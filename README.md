# Conviction Voting Discord Bot

A Discord bot that notifies about proposals

## Developer quick start 👩‍💻

- `npm start`: Starts up the bot without hot reloading.
- `npm run dev` will launch the bot locally, with hot reloading included.
- `npm run lint` will lint the code.

### Configuration

First, install the dependencies: `npm install`

For the bot to run properly, it needs these variables, laid out in the `.env.sample` file:

- `DISCORD_API_TOKEN`: Your discord API token. [See this guide on how to obtain one](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).
- `GUILD_ID`: Your Discord server ID.
- `PROPOSALS_CHANNEL`: The ID of the proposals feed channel.
- `PROVIDER`: Your Ethereum provider.
