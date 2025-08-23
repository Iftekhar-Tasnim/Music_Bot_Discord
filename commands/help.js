const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Show all available commands',
    async execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('🎵 Music Bot Commands')
            .setDescription(`Prefix: \`${config.prefix}\``)
            .addFields(
                {
                    name: '🎵 Playback Commands',
                    value: [
                        `\`${config.prefix}play <song>\` - Play a song from YouTube`,
                        `\`${config.prefix}pause\` - Pause the current song`,
                        `\`${config.prefix}resume\` - Resume the paused song`,
                        `\`${config.prefix}skip\` - Skip the current song`,
                        `\`${config.prefix}stop\` - Stop music and disconnect`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '📋 Queue Commands',
                    value: [
                        `\`${config.prefix}queue\` - Show the music queue`,
                        `\`${config.prefix}nowplaying\` - Show current song info`,
                        `\`${config.prefix}shuffle\` - Shuffle the queue`,
                        `\`${config.prefix}clear\` - Clear the queue`,
                        `\`${config.prefix}remove <position>\` - Remove song from queue`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '⚙️ Settings Commands',
                    value: [
                        `\`${config.prefix}volume <1-100>\` - Change/check volume`,
                        `\`${config.prefix}loop [song|queue|off]\` - Toggle loop modes`,
                        `\`${config.prefix}search <query>\` - Search for songs`,
                        `\`${config.prefix}seek <time>\` - Seek to time (MM:SS)`,
                        `\`${config.prefix}filters <name>\` - Apply audio filters`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '🎤 Extra Commands',
                    value: [
                        `\`${config.prefix}lyrics [song]\` - Get song lyrics`,
                        `\`${config.prefix}bassboost\` - Toggle bass boost`,
                        `\`${config.prefix}playlist <url>\` - Play YouTube playlist`,
                        `\`${config.prefix}stats\` - Show bot statistics`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '🔗 Aliases',
                    value: [
                        `**play**: p • **playlist**: pl`,
                        `**skip**: s, next • **seek**: jump, goto`,
                        `**queue**: q, list • **search**: find`,
                        `**nowplaying**: np, current`,
                        `**volume**: vol, v • **bassboost**: bass, bb`,
                        `**resume**: unpause • **filters**: filter, effects`,
                        `**stop**: disconnect, dc, leave`,
                        `**loop**: repeat • **lyrics**: lyric, words`,
                        `**clear**: empty • **remove**: delete, rm`,
                        `**stats**: statistics, botinfo, info`
                    ].join('\n'),
                    inline: false
                }
            )
            .setFooter({ 
                text: `${client.user.username} • Use ${config.prefix}help <command> for detailed info`,
                iconURL: client.user.displayAvatarURL() 
            })
            .setTimestamp();
        
        // If specific command requested
        if (args[0]) {
            const commandName = args[0].toLowerCase();
            const command = client.commands.get(commandName) || 
                           client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            
            if (command) {
                const helpEmbed = new EmbedBuilder()
                    .setColor('#0099FF')
                    .setTitle(`📖 Command: ${command.name}`)
                    .setDescription(command.description)
                    .addFields({ name: 'Usage', value: `\`${config.prefix}${command.usage || command.name}\`` });
                
                if (command.aliases) {
                    helpEmbed.addFields({ name: 'Aliases', value: command.aliases.map(alias => `\`${alias}\``).join(', ') });
                }
                
                return message.reply({ embeds: [helpEmbed] });
            }
        }
        
        message.reply({ embeds: [embed] });
    }
};
