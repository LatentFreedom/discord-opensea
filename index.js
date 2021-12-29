const {Constants, Client, Intents, MessageEmbed} = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

let data = {};

client.on('ready', () => {
    console.log('Opensea Tracker Running...');
    createCommands();
    getJsonData();
    client.user.setActivity(`OpenSea`, {type: 3});
});

const getJsonData = () => {
    let rawdata = fs.readFileSync('collectioninfo.json');
    data = JSON.parse(rawdata);
    console.log(data);
}

const saveJsonData = () => {
    jsonData = JSON.stringify(data, null, '\t');
    let res = fs.writeFileSync('collectioninfo.json', jsonData);
}

const getCollection = async (collection) => {
    try {
        // Get new data from opensea
        let req = `https://api.opensea.io/api/v1/collection/${collection}/stats`;
        const res = await axios.get(req);
        if (res.statusCode == 404) { return null; }
        const stats = res.data;
        setCollection(collection,stats);
        return stats;
    } catch (err) {
        console.log(err);
    }
}

const setCollection = (collection, stats) => {
    for (const [i, c] of Object.entries(data.collections)) {
        if (collection == c.name) {
            data.collections[i].stats = stats;
            data.collections[i].timestamp = Date.now();
        }
    };
    saveJsonData();
}

const styleHelpMessage = () => {
    const embed = new MessageEmbed().setTitle('Command Help');
    embed.setDescription('The following are the available opensea info commands. If you want to see all the stats together use **/stat**')
    embed.addFields(
        { name: '/stats', value: 'Show stats' },
        { name: '/supply', value: 'Show total supply' },
        { name: '/floor', value: 'Show floor price' },
        { name: '/owners', value: 'Show total owners' },
    );
    return {embeds: [embed]};   
}

const styleStatsMessage = (collection,stats) => {
    s = stats.stats;
    const embed = new MessageEmbed().setTitle(`${collection} Stats`);
    embed.addFields(
        { name: 'Market Cap', value: String(s.market_cap.toFixed(2)), inline: true },
        { name: 'Floor', value: String(s.floor_price.toFixed(2)), inline: true },
        { name: 'Volume', value: String(s.total_volume.toFixed(2)), inline: true },
        { name: 'Sales', value: String(s.total_sales.toFixed(2)), inline: true },
        { name: 'Supply', value: String(s.total_supply.toFixed(2)), inline: true },
        { name: 'Count', value: String(s.count.toFixed(2)), inline: true },
        { name: 'Owners', value: String(s.num_owners.toFixed(2)), inline: true },
        { name: 'Average Price', value: String(s.average_price.toFixed(2)), inline: true },
        { name: 'Reports', value: String(s.num_reports.toFixed(2)), inline: true },

        { name: '\u200B', value: '\u200B' },

        { name: '1 Day', value: '\u200B', inline: true },
        { name: '7 Day', value: '\u200B', inline: true },
        { name: '30 Day', value: '\u200B', inline: true },        

        { name: 'Volume', value: String(s.one_day_volume.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.seven_day_volume.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.thirty_day_volume.toFixed(2)), inline: true },

        { name: 'Change', value: String(s.one_day_change.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.seven_day_change.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.thirty_day_change.toFixed(2)), inline: true },

        { name: 'Sales', value: String(s.one_day_sales.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.seven_day_sales.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.thirty_day_sales.toFixed(2)), inline: true },

        { name: 'Average Price', value: String(s.one_day_average_price.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.seven_day_average_price.toFixed(2)), inline: true },
        { name: '\u200B', value: String(s.thirty_day_average_price.toFixed(2)), inline: true },

        { name: '\u200B', value: '\u200B' },

    );
    embed.setTimestamp();
    return {embeds: [embed]}; 
}

const styleSupplyMessage = (collection,stats) => {
    const embed = new MessageEmbed().setTitle(`${collection} Supply`);
    embed.setDescription(`Total supply is **${stats.stats.total_supply}**`);
    return {embeds: [embed]}; 
}

const styleFloorMessage = (collection,stats) => {
    const embed = new MessageEmbed().setTitle(`${collection} Floor Price`);
    embed.setDescription(`Current floor is **${stats.stats.floor_price}**`);
    return {embeds: [embed]}; 
}

const styleOwnersMessage = (collection,stats) => {
    const embed = new MessageEmbed().setTitle(`${collection} Owners`);
    embed.setDescription(`Total owners is **${stats.stats.num_owners}**`);
    return {embeds: [embed]}; 
}

const styleBadCollectionMessage = (collection) => {
    const embed = new MessageEmbed().setTitle(`${collection} Not Found`);
    embed.setDescription(`**Unknown collection**. Check the url value for the desired collection on opensea. Example url: **https://opensea.io/collection/neotokyo-outer-identities**`);
    return {embeds: [embed]};
}

const createCommands = () => {
    const Guilds = client.guilds.cache.map(guild => guild.id);
    // Add commands to all guilds
    Guilds.forEach(guildId => {
        const guild = client.guilds.cache.get(guildId);
        let commands = guild.commands;
        // Show Help
        commands?.create({
            name: "help",
            description: "Show all the commands possible"
        });
        // Stats
        commands?.create({
            name: "stats",
            description: "Show stats for given collection",
            options: [
                {
                    name: "collection",
                    description: "link name for the collection",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        });
        // Supply
        commands?.create({
            name: "supply",
            description: "Show total supply for given collection",
            options: [
                {
                    name: "collection",
                    description: "link name for the collection",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        });
        // Floor
        commands?.create({
            name: "floor",
            description: "Show floor price for given collection",
            options: [
                {
                    name: "collection",
                    description: "link name for the collection",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        });
        // Owners
        commands?.create({
            name: "owners",
            description: "Show total owners for given collection",
            options: [
                {
                    name: "collection",
                    description: "link name for the collection",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        });
    });
}

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isCommand()) { return; }
        // Check if command was sent in desired channel
        if (process.env.CHANNEL_ID && interaction.channel.id !== process.env.CHANNEL_ID) {
            await interaction.reply({
                ephemeral: true,
                content: 'This command cannot be used in this channel.'
            });
            return;
        }
        let content = {};
        const { commandName, options } = interaction;
        await interaction.deferReply({});
        if (commandName === 'help') {
            content = styleHelpMessage();
        } else {
            // Get collection stats
            const collection = options.getString('collection');
            const stats = await getCollection(collection);
            console.log(stats);
            if (!stats) {
                content = styleBadCollectionMessage();
            } else if (commandName === 'stats') {
                content = styleStatsMessage(collection,stats);
            } else if (commandName === 'supply') {
                content = styleSupplyMessage(collection,stats);
            } else if (commandName === 'floor') {
                content = styleFloorMessage(collection,stats);
            } else if (commandName === 'owners') {
                content = styleOwnersMessage(collection,stats);
            }
        }
        await interaction.editReply(content);
    } catch (err) {
        console.log(err);
    }
})

client.login(process.env.DISCORD_TOKEN);