# Discord Opensea Bot
Get a bot to check opensea collection data in discord.

## Sites Used
1. Discord Dev URL **[https://discord.com/developers/applications](https://discord.com/developers/applications)**
2. Discord Bot Docs **[https://discord.com/developers/docs/intro](https://discord.com/developers/docs/intro)**
3. Opensea API **[https://docs.opensea.io/reference/api-overview](https://docs.opensea.io/reference/api-overview)**

## Running the bot
1. Get the needed packages with `npm install`
2. Create `.env` and fill it with the needed values
3. Create `collectioninfo.json` and fill it with the needed values
4. run with `node index.js`

## Values in `.env`
```
DISCORD_TOKEN=
# guild id for the discord server that commands will be in
GUILD_ID=
# channel id for the channel that will reply to the commands
CHANNEL_ID=
```

## Values in `collectioninfo.json`
```
{
    "collections": [
        {
            "name":"collection-name",
            "stats" : {},
            "timestamp" : 0,
        }
    ]
}
```

## Discord / Commands
1. **help:** Show help menu with all the commands listed
2. **stats:** Show all the stats pulled from OpenSea
3. **supply:** Show total supply of given collection
4. **floor:** Show floor price for given collection
5. **owners:** Show total owners of given collection