const { EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
    name: 'lyrics',
    aliases: ['lyric', 'words'],
    description: 'Get lyrics for the current song or a specified song',
    usage: 'lyrics [song name]',
    async execute(message, args, client) {
        let songTitle = '';
        
        if (args.length > 0) {
            // User provided song name
            songTitle = args.join(' ');
        } else {
            // Get from current playing song
            const queue = client.queues.get(message.guild.id);
            if (!queue || !queue.currentSong) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No song is currently playing! Please specify a song name.')
                    .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
                return message.reply({ embeds: [embed] });
            }
            songTitle = queue.currentSong.title;
        }
        
        // Send searching message
        const searchEmbed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setDescription('🔍 Searching for lyrics...');
        const searchMessage = await message.reply({ embeds: [searchEmbed] });
        
        try {
            // Clean up song title for better search results
            const cleanTitle = songTitle
                .replace(/\(.*?\)/g, '') // Remove content in parentheses
                .replace(/\[.*?\]/g, '') // Remove content in brackets
                .replace(/official|video|music|lyric|hd|4k/gi, '') // Remove common words
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .trim();
            
            const lyrics = await searchLyrics(cleanTitle);
            
            if (!lyrics) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ No Lyrics Found')
                    .setDescription(`No lyrics found for: **${songTitle}**`)
                    .addFields({ 
                        name: 'Try:', 
                        value: '• Check the song title spelling\n• Try with a different song name\n• Some songs may not have lyrics available' 
                    });
                return searchMessage.edit({ embeds: [embed] });
            }
            
            // Split lyrics if too long for Discord embed
            const maxLength = 4096;
            if (lyrics.length <= maxLength) {
                const embed = new EmbedBuilder()
                    .setColor('#0099FF')
                    .setTitle(`🎵 Lyrics: ${songTitle}`)
                    .setDescription(lyrics)
                    .setTimestamp()
                    .setFooter({ text: 'Lyrics provided by lyrics.ovh' });
                
                await searchMessage.edit({ embeds: [embed] });
            } else {
                // Split into multiple embeds
                const chunks = splitLyrics(lyrics, maxLength - 200); // Leave room for title and other content
                
                for (let i = 0; i < chunks.length && i < 3; i++) { // Limit to 3 parts max
                    const embed = new EmbedBuilder()
                        .setColor('#0099FF')
                        .setTitle(i === 0 ? `🎵 Lyrics: ${songTitle}` : `🎵 Lyrics: ${songTitle} (Part ${i + 1})`)
                        .setDescription(chunks[i])
                        .setTimestamp()
                        .setFooter({ text: 'Lyrics provided by lyrics.ovh' });
                    
                    if (i === 0) {
                        await searchMessage.edit({ embeds: [embed] });
                    } else {
                        await message.channel.send({ embeds: [embed] });
                    }
                }
                
                if (chunks.length > 3) {
                    const moreEmbed = new EmbedBuilder()
                        .setColor('#FFFF00')
                        .setDescription('📝 Lyrics were too long to display completely. Showing first 3 parts only.');
                    await message.channel.send({ embeds: [moreEmbed] });
                }
            }
            
        } catch (error) {
            console.error('Lyrics command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch lyrics. Please try again later.');
            
            await searchMessage.edit({ embeds: [errorEmbed] });
        }
    }
};

/**
 * Search for lyrics using lyrics.ovh API
 */
async function searchLyrics(songTitle) {
    return new Promise((resolve, reject) => {
        // Try to extract artist and title
        const parts = songTitle.split('-').map(part => part.trim());
        let artist = '', title = '';
        
        if (parts.length >= 2) {
            artist = parts[0];
            title = parts.slice(1).join('-').trim();
        } else {
            // If no artist separator found, try common patterns
            const commonSeparators = [' by ', ' - ', ' | '];
            let found = false;
            
            for (const separator of commonSeparators) {
                if (songTitle.includes(separator)) {
                    const splitResult = songTitle.split(separator);
                    if (splitResult.length >= 2) {
                        title = splitResult[0].trim();
                        artist = splitResult[1].trim();
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                // No clear artist/title separation, use entire string as title
                title = songTitle;
                artist = '';
            }
        }
        
        // Encode for URL
        const encodedArtist = encodeURIComponent(artist);
        const encodedTitle = encodeURIComponent(title);
        
        const url = `https://api.lyrics.ovh/v1/${encodedArtist}/${encodedTitle}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.lyrics) {
                        resolve(response.lyrics.trim());
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    resolve(null);
                }
            });
        }).on('error', (error) => {
            resolve(null);
        });
    });
}

/**
 * Split lyrics into chunks that fit in Discord embeds
 */
function splitLyrics(lyrics, maxLength) {
    const lines = lyrics.split('\n');
    const chunks = [];
    let currentChunk = '';
    
    for (const line of lines) {
        if ((currentChunk + line + '\n').length > maxLength) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // If a single line is too long, split it
            if (line.length > maxLength) {
                const words = line.split(' ');
                let currentLine = '';
                
                for (const word of words) {
                    if ((currentLine + word + ' ').length > maxLength) {
                        if (currentLine) {
                            chunks.push(currentLine.trim());
                            currentLine = '';
                        }
                        currentLine = word + ' ';
                    } else {
                        currentLine += word + ' ';
                    }
                }
                
                if (currentLine) {
                    currentChunk = currentLine;
                }
            } else {
                currentChunk = line + '\n';
            }
        } else {
            currentChunk += line + '\n';
        }
    }
    
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks;
}
