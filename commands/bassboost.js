const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'bassboost',
    aliases: ['bass', 'bb'],
    description: 'Toggle bass boost effect (simulated with volume boost)',
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
        
        // Toggle bass boost (simulated with volume)
        queue.bassBoost = !queue.bassBoost;
        
        if (queue.bassBoost) {
            // Increase volume for bass boost effect
            const originalVolume = queue.volume;
            queue.bassBoostOriginalVolume = originalVolume;
            queue.setVolume(Math.min(100, originalVolume + 25));
        } else {
            // Restore original volume
            if (queue.bassBoostOriginalVolume) {
                queue.setVolume(queue.bassBoostOriginalVolume);
            }
        }
        
        const embed = new EmbedBuilder()
            .setColor(queue.bassBoost ? '#00FF00' : '#FF0000')
            .setTitle('🎵 Bass Boost')
            .setDescription(`Bass boost has been **${queue.bassBoost ? 'enabled' : 'disabled'}**`)
            .addFields({ 
                name: 'Current Volume', 
                value: `${queue.volume}%`, 
                inline: true 
            });
        
        if (queue.bassBoost) {
            embed.addFields({ 
                name: 'Note', 
                value: 'This is a simulated bass boost using volume adjustment. For true audio effects, consider using a dedicated audio processing bot.' 
            });
        }
        
        message.reply({ embeds: [embed] });
    }
};
