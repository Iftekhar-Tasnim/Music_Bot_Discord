const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    aliases: ['s', 'next'],
    description: 'Skip the currently playing song',
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
        
        const skippedSong = queue.currentSong;
        queue.skip();
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('⏭️ Song Skipped')
            .setDescription(`Skipped: **[${skippedSong.title}](${skippedSong.url})**`);
        
        if (queue.songs.length > 0) {
            embed.addFields({ name: 'Up Next', value: `**[${queue.songs[0].title}](${queue.songs[0].url})**` });
        } else {
            embed.addFields({ name: 'Queue Status', value: 'No more songs in queue' });
        }
        
        message.reply({ embeds: [embed] });
    }
};
