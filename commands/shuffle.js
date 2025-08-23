const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the music queue',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ The queue is empty or too short to shuffle!');
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
        
        if (queue.songs.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Need at least 2 songs in queue to shuffle!');
            return message.reply({ embeds: [embed] });
        }
        
        queue.shuffle();
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔀 Queue Shuffled')
            .setDescription(`Successfully shuffled **${queue.songs.length}** songs in the queue!`);
        
        message.reply({ embeds: [embed] });
    }
};
