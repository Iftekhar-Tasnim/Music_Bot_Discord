const { EmbedBuilder } = require('discord.js');
const { truncateText } = require('../utils/musicUtils');

module.exports = {
    name: 'queue',
    aliases: ['q', 'list'],
    description: 'Show the current music queue',
    usage: 'queue [page number]',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || (!queue.currentSong && queue.songs.length === 0)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ The music queue is empty!');
            return message.reply({ embeds: [embed] });
        }
        
        const queueInfo = queue.getQueue();
        const songsPerPage = 10;
        const page = Math.max(1, parseInt(args[0]) || 1);
        const startIndex = (page - 1) * songsPerPage;
        const endIndex = startIndex + songsPerPage;
        const totalPages = Math.ceil(queueInfo.upcoming.length / songsPerPage);
        
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('🎵 Music Queue')
            .setTimestamp();
        
        // Current song
        if (queueInfo.current) {
            embed.addFields({
                name: '🎵 Now Playing',
                value: `**[${truncateText(queueInfo.current.title, 40)}](${queueInfo.current.url})**\n` +
                       `Duration: ${queueInfo.current.duration} | Requested by: ${queueInfo.current.requestedBy}`,
                inline: false
            });
        }
        
        // Queue info
        if (queueInfo.upcoming.length > 0) {
            const queueList = queueInfo.upcoming
                .slice(startIndex, endIndex)
                .map((song, index) => {
                    const position = startIndex + index + 1;
                    return `**${position}.** [${truncateText(song.title, 35)}](${song.url})\n` +
                           `Duration: ${song.duration} | Requested by: ${song.requestedBy}`;
                })
                .join('\n\n');
            
            embed.addFields({
                name: `📋 Up Next (${queueInfo.total} songs)`,
                value: queueList || 'No upcoming songs',
                inline: false
            });
            
            if (totalPages > 1) {
                embed.setFooter({ text: `Page ${page}/${totalPages} • Use ${message.prefix || '!'}queue <page> to view other pages` });
            }
        }
        
        // Queue settings
        const settings = [];
        if (queueInfo.loop) settings.push('🔂 Loop');
        if (queueInfo.loopQueue) settings.push('🔁 Loop Queue');
        settings.push(`🔊 Volume: ${queueInfo.volume}%`);
        
        embed.addFields({
            name: '⚙️ Settings',
            value: settings.join(' • '),
            inline: false
        });
        
        message.reply({ embeds: [embed] });
    }
};
