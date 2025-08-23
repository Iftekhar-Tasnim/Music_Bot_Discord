const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { isYouTubePlaylist, getVideoInfo } = require('../utils/musicUtils');
const MusicQueue = require('../utils/MusicQueue');
const ytpl = require('ytpl');

module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    description: 'Play a YouTube playlist',
    usage: 'playlist <YouTube playlist URL>',
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
        
        // Check if playlist URL provided
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Please provide a YouTube playlist URL!')
                .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
            return message.reply({ embeds: [embed] });
        }
        
        const playlistUrl = args[0];
        
        if (!isYouTubePlaylist(playlistUrl)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Please provide a valid YouTube playlist URL!');
            return message.reply({ embeds: [embed] });
        }
        
        // Get or create music queue
        let queue = client.queues.get(message.guild.id);
        if (!queue) {
            queue = new MusicQueue(message.guild);
            client.queues.set(message.guild.id, queue);
        }
        
        try {
            // Send loading message
            const loadingEmbed = new EmbedBuilder()
                .setColor('#FFFF00')
                .setDescription('🔍 Loading playlist...');
            const loadingMessage = await message.reply({ embeds: [loadingEmbed] });
            
            // Get playlist information
            const playlist = await ytpl(playlistUrl);
            
            if (!playlist.items || playlist.items.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ This playlist is empty or unavailable!');
                return loadingMessage.edit({ embeds: [embed] });
            }
            
            // Filter valid videos and limit to prevent spam
            const validVideos = playlist.items
                .filter(item => item.id && item.title && item.url)
                .slice(0, 50); // Limit to 50 songs
            
            if (validVideos.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No playable videos found in this playlist!');
                return loadingMessage.edit({ embeds: [embed] });
            }
            
            // Convert to song format
            const songs = validVideos.map(video => ({
                title: video.title,
                url: video.url,
                duration: video.duration || 'Unknown',
                durationSeconds: video.durationSec || 0,
                thumbnail: video.thumbnails?.[0]?.url,
                author: video.author?.name || 'Unknown',
                views: video.views || 0,
                requestedBy: message.author
            }));
            
            // Join voice channel if not connected
            if (!queue.connection) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                queue.connection = connection;
            }
            
            // Add songs to queue
            try {
                queue.addSongs(songs);
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ ${error.message}`);
                return loadingMessage.edit({ embeds: [embed] });
            }
            
            // Create success embed
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('📋 Playlist Added')
                .setDescription(`**[${playlist.title}](${playlistUrl})**`)
                .addFields(
                    { name: '🎵 Songs Added', value: `${songs.length}`, inline: true },
                    { name: '📊 Total in Queue', value: `${queue.songs.length + (queue.isPlaying ? 1 : 0)}`, inline: true },
                    { name: '👤 Requested by', value: message.author.toString(), inline: true }
                )
                .setThumbnail(playlist.thumbnails?.[0]?.url)
                .setTimestamp();
            
            // Start playing if not already playing
            if (!queue.isPlaying) {
                try {
                    const currentSong = await queue.play();
                    embed.addFields({ 
                        name: '🎵 Now Playing', 
                        value: `**[${currentSong.title}](${currentSong.url})**` 
                    });
                } catch (playError) {
                    console.error('Error starting playback:', playError);
                }
            }
            
            await loadingMessage.edit({ embeds: [embed] });
            
        } catch (error) {
            console.error('Playlist command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Error')
                .setDescription(`Failed to load playlist: ${error.message}`);
            
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
