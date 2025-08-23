const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',
    aliases: ['empty'],
    description: 'Clear the music queue',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ The queue is already empty!');
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
        
        const clearedCount = queue.songs.length;
        queue.songs = [];
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🗑️ Queue Cleared')
            .setDescription(`Successfully cleared **${clearedCount}** songs from the queue!`);
        
        message.reply({ embeds: [embed] });
    }
};
