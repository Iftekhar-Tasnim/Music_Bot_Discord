const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Toggle loop mode for the current song or queue',
    usage: 'loop [song|queue|off]',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ There is no music queue for this server!');
            return message.reply({ embeds: [embed] });
        }
        
        // Check if user is in the same voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.connection.joinConfig.channelId) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ You need to be in the same voice channel as the bot!');
            return message.reply({ embeds: [embed] });
        }
        
        const mode = args[0]?.toLowerCase();
        let description = '';
        
        switch (mode) {
            case 'song':
            case 'track':
                queue.setLoop(true);
                queue.setLoopQueue(false);
                description = '🔂 Loop mode enabled for current song';
                break;
                
            case 'queue':
            case 'all':
                queue.setLoop(false);
                queue.setLoopQueue(true);
                description = '🔁 Loop mode enabled for entire queue';
                break;
                
            case 'off':
            case 'disable':
                queue.setLoop(false);
                queue.setLoopQueue(false);
                description = '⏹️ Loop mode disabled';
                break;
                
            default:
                // Toggle song loop by default
                if (queue.loop) {
                    queue.setLoop(false);
                    description = '⏹️ Song loop disabled';
                } else {
                    queue.setLoop(true);
                    queue.setLoopQueue(false);
                    description = '🔂 Song loop enabled';
                }
                break;
        }
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔄 Loop Settings')
            .setDescription(description)
            .addFields(
                { name: 'Current Status', value: `Song Loop: ${queue.loop ? '✅' : '❌'}\nQueue Loop: ${queue.loopQueue ? '✅' : '❌'}`, inline: true },
                { name: 'Usage', value: `\`${this.usage}\``, inline: true }
            );
        
        message.reply({ embeds: [embed] });
    }
};
