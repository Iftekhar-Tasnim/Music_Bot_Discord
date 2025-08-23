const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    aliases: ['np', 'current', 'playing'],
    description: 'Show information about the currently playing song',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || !queue.currentSong) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ There is no music currently playing!');
            return message.reply({ embeds: [embed] });
        }
        
        const song = queue.currentSong;
        
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('🎵 Now Playing')
            .setDescription(`**[${song.title}](${song.url})**`)
            .addFields(
                { name: '👤 Author', value: song.author, inline: true },
                { name: '⏱️ Duration', value: song.duration, inline: true },
                { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
                { name: '📻 Requested by', value: song.requestedBy.toString(), inline: true },
                { name: '👁️ Views', value: song.views ? song.views.toLocaleString() : 'N/A', inline: true },
                { name: '📋 Queue Length', value: `${queue.songs.length} songs`, inline: true }
            )
            .setThumbnail(song.thumbnail)
            .setTimestamp();
        
        // Add loop status
        const settings = [];
        if (queue.loop) settings.push('🔂 Loop');
        if (queue.loopQueue) settings.push('🔁 Loop Queue');
        
        if (settings.length > 0) {
            embed.addFields({ name: '⚙️ Settings', value: settings.join(' • '), inline: false });
        }
        
        message.reply({ embeds: [embed] });
    }
};
