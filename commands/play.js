const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { isYouTubeURL, getVideoInfo, searchYouTube } = require('../utils/musicUtils');
const MusicQueue = require('../utils/MusicQueue');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Play a song from YouTube',
    usage: 'play <song name or YouTube URL>',
    async execute(message, args, client) {
        // Check if user is in a voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ You need to be in a voice channel to play music!');
            return message.reply({ embeds: [embed] });
        }
        
        // Check bot permissions
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has(['Connect', 'Speak'])) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ I need permissions to join and speak in your voice channel!');
            return message.reply({ embeds: [embed] });
        }
        
        // Check if query provided
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Please provide a song name or YouTube URL!')
                .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
            return message.reply({ embeds: [embed] });
        }
        
        const query = args.join(' ');
        
        // Get or create music queue
        let queue = client.queues.get(message.guild.id);
        if (!queue) {
            queue = new MusicQueue(message.guild);
            client.queues.set(message.guild.id, queue);
        }
        
        try {
            // Send searching message
            const searchEmbed = new EmbedBuilder()
                .setColor('#FFFF00')
                .setDescription('🔍 Searching for music...');
            const searchMessage = await message.reply({ embeds: [searchEmbed] });
            
            let songInfo;
            
            if (isYouTubeURL(query)) {
                // Direct YouTube URL
                songInfo = await getVideoInfo(query);
            } else {
                // Try to search, but provide helpful error if it fails
                try {
                    const searchResults = await searchYouTube(query, 1);
                    songInfo = searchResults[0];
                } catch (searchError) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('⚠️ Search Not Available')
                        .setDescription('Search functionality is currently limited. Please provide a direct YouTube URL.')
                        .addFields({ 
                            name: 'Example', 
                            value: '`!play https://youtube.com/watch?v=dQw4w9WgXcQ`' 
                        });
                    
                    await searchMessage.edit({ embeds: [errorEmbed] });
                    return;
                }
            }
            
            // Add user info
            songInfo.requestedBy = message.author;
            
            // Join voice channel if not connected
            if (!queue.connection) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                queue.connection = connection;
            }
            
            // Add song to queue
            queue.addSong(songInfo);
            
            if (queue.isPlaying) {
                // Song added to queue
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('🎵 Added to Queue')
                    .setDescription(`**[${songInfo.title}](${songInfo.url})**`)
                    .addFields(
                        { name: 'Duration', value: songInfo.duration, inline: true },
                        { name: 'Position in Queue', value: `${queue.songs.length}`, inline: true },
                        { name: 'Requested by', value: songInfo.requestedBy.toString(), inline: true }
                    )
                    .setThumbnail(songInfo.thumbnail)
                    .setTimestamp();
                
                await searchMessage.edit({ embeds: [embed] });
            } else {
                // Start playing immediately
                const currentSong = await queue.play();
                
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('🎵 Now Playing')
                    .setDescription(`**[${currentSong.title}](${currentSong.url})**`)
                    .addFields(
                        { name: 'Duration', value: currentSong.duration, inline: true },
                        { name: 'Author', value: currentSong.author, inline: true },
                        { name: 'Requested by', value: currentSong.requestedBy.toString(), inline: true }
                    )
                    .setThumbnail(currentSong.thumbnail)
                    .setTimestamp();
                
                await searchMessage.edit({ embeds: [embed] });
            }
            
        } catch (error) {
            console.error('Play command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Error')
                .setDescription(`Failed to play music: ${error.message}`);
            
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
