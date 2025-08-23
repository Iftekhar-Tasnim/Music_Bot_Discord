const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'seek',
    aliases: ['jump', 'goto'],
    description: 'Seek to a specific time in the current song (restarts song)',
    usage: 'seek <time> (format: MM:SS or seconds)',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue || !queue.currentSong) {
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
        
        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Please specify a time to seek to!')
                .addFields({ 
                    name: 'Usage', 
                    value: `\`${this.usage}\`\nExamples: \`!seek 1:30\` or \`!seek 90\`` 
                });
            return message.reply({ embeds: [embed] });
        }
        
        const timeInput = args[0];
        let seekSeconds = 0;
        
        // Parse time input
        if (timeInput.includes(':')) {
            // Format MM:SS or HH:MM:SS
            const parts = timeInput.split(':').map(Number);
            if (parts.length === 2) {
                seekSeconds = parts[0] * 60 + parts[1];
            } else if (parts.length === 3) {
                seekSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Invalid time format! Use MM:SS or seconds.');
                return message.reply({ embeds: [embed] });
            }
        } else {
            // Format: seconds
            seekSeconds = parseInt(timeInput);
            if (isNaN(seekSeconds)) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Invalid time format! Use MM:SS or seconds.');
                return message.reply({ embeds: [embed] });
            }
        }
        
        // Validate seek time
        if (seekSeconds < 0) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Seek time cannot be negative!');
            return message.reply({ embeds: [embed] });
        }
        
        if (seekSeconds > queue.currentSong.durationSeconds) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`❌ Seek time cannot exceed song duration (${queue.currentSong.duration})!`);
            return message.reply({ embeds: [embed] });
        }
        
        try {
            // Store current song and add it back to the beginning of queue with seek time
            const currentSong = { ...queue.currentSong };
            currentSong.seekTime = seekSeconds;
            
            // Stop current song and add it back to queue start
            queue.songs.unshift(currentSong);
            queue.skip();
            
            // Format seek time for display
            const seekMinutes = Math.floor(seekSeconds / 60);
            const seekSecondsRemainder = seekSeconds % 60;
            const seekTimeString = `${seekMinutes}:${seekSecondsRemainder.toString().padStart(2, '0')}`;
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('⏩ Seeking')
                .setDescription(`Seeking to **${seekTimeString}** in **[${currentSong.title}](${currentSong.url})**`)
                .addFields({ name: 'Note', value: 'The song will restart from the beginning as Discord doesn\'t support true seeking.' });
            
            message.reply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Seek command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Failed to seek! Please try again.');
            
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
