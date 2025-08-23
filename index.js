const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const MusicQueue = require('./utils/MusicQueue');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Collections for commands and music queues
client.commands = new Collection();
client.queues = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Bot ready event
client.once('ready', () => {
    console.log(`🎵 ${client.user.tag} is online and ready to play music!`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    
    // Set bot activity
    client.user.setActivity('music | ' + config.prefix + 'help', { type: 2 }); // 2 = LISTENING
});

// Message handling
client.on('messageCreate', async (message) => {
    // Ignore bot messages and messages without prefix
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;
    
    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error('Command execution error:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ Error')
            .setDescription('There was an error executing that command!')
            .setTimestamp();
            
        message.reply({ embeds: [errorEmbed] });
    }
});

// Voice state update handling
client.on('voiceStateUpdate', (oldState, newState) => {
    // Handle bot being disconnected
    if (oldState.member?.user.bot && oldState.member?.user.id === client.user.id) {
        if (!newState.channelId) {
            // Bot was disconnected, cleanup queue
            const queue = client.queues.get(oldState.guild.id);
            if (queue) {
                queue.stop();
                client.queues.delete(oldState.guild.id);
            }
        }
    }
    
    // Auto-leave when alone in voice channel
    if (oldState.channelId && !newState.channelId) {
        const voiceChannel = oldState.channel;
        if (voiceChannel && voiceChannel.members.size === 1) {
            const botMember = voiceChannel.members.find(member => member.user.bot);
            if (botMember && botMember.user.id === client.user.id) {
                const connection = getVoiceConnection(oldState.guild.id);
                if (connection) {
                    setTimeout(() => {
                        // Check again after 30 seconds
                        if (voiceChannel.members.size === 1) {
                            connection.destroy();
                            const queue = client.queues.get(oldState.guild.id);
                            if (queue) {
                                queue.stop();
                                client.queues.delete(oldState.guild.id);
                            }
                        }
                    }, 30000); // 30 seconds delay
                }
            }
        }
    }
});

// Error handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

// Login to Discord
if (!config.token) {
    console.error('❌ No Discord token provided! Please check your .env file.');
    process.exit(1);
}

client.login(config.token).catch((error) => {
    console.error('❌ Failed to login to Discord:', error);
    process.exit(1);
});
