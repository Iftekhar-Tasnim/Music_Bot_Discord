const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'resume',
    aliases: ['unpause'],
    description: 'Resume the currently paused song',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || !queue.currentSong) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ There is no music to resume!');
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
        
        queue.resume();
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setDescription('▶️ Music has been resumed');
        
        message.reply({ embeds: [embed] });
    }
};
