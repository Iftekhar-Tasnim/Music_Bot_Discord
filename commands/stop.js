const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'stop',
    aliases: ['disconnect', 'dc', 'leave'],
    description: 'Stop the music and clear the queue',
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
        
        queue.stop();
        if (queue.connection) {
            queue.connection.destroy();
        }
        client.queues.delete(message.guild.id);
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setDescription('⏹️ Music stopped and queue cleared. Goodbye! 👋');
        
        message.reply({ embeds: [embed] });
    }
};
