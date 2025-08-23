const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove',
    aliases: ['delete', 'rm'],
    description: 'Remove a song from the queue',
    usage: 'remove <position>',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ The queue is empty!');
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
        
        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Please specify the position of the song to remove!')
                .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
            return message.reply({ embeds: [embed] });
        }
        
        const position = parseInt(args[0]);
        
        if (isNaN(position) || position < 1 || position > queue.songs.length) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`❌ Invalid position! Please specify a number between 1 and ${queue.songs.length}.`);
            return message.reply({ embeds: [embed] });
        }
        
        try {
            const removedSong = queue.removeSong(position - 1);
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🗑️ Song Removed')
                .setDescription(`Removed: **[${removedSong.title}](${removedSong.url})**`)
                .addFields({ 
                    name: 'Position', 
                    value: `${position}`, 
                    inline: true 
                }, {
                    name: 'Remaining Songs',
                    value: `${queue.songs.length}`,
                    inline: true
                });
            
            message.reply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`❌ Failed to remove song: ${error.message}`);
            message.reply({ embeds: [embed] });
        }
    }
};
