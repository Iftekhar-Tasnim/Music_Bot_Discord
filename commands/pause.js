const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pause the currently playing song',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || !queue.isPlaying) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ There is no music currently playing!');
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
        
        queue.pause();
        
        const embed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setDescription('⏸️ Music has been paused');
        
        message.reply({ embeds: [embed] });
    }
};
