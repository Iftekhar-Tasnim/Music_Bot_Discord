const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

/**
 * Validates if a URL is a valid YouTube URL
 */
function isYouTubeURL(url) {
    const ytRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return ytRegex.test(url);
}

/**
 * Validates if a URL is a valid YouTube playlist
 */
function isYouTubePlaylist(url) {
    return url.includes('playlist?list=') || url.includes('&list=');
}

/**
 * Gets video information from YouTube URL
 */
async function getVideoInfo(url) {
    try {
        if (!ytdl.validateURL(url)) {
            throw new Error('Invalid YouTube URL');
        }
        
        const info = await ytdl.getInfo(url);
        const details = info.videoDetails;
        
        return {
            title: details.title,
            url: details.video_url,
            duration: formatDuration(details.lengthSeconds),
            durationSeconds: parseInt(details.lengthSeconds),
            thumbnail: details.thumbnails[details.thumbnails.length - 1]?.url,
            author: details.author.name,
            views: details.viewCount,
            requestedBy: null // Will be set by the command
        };
    } catch (error) {
        throw new Error(`Failed to get video info: ${error.message}`);
    }
}

/**
 * Searches YouTube for videos
 */
async function searchYouTube(query, limit = 1) {
    try {
        const searchResults = await ytsr(query, { limit });
        const videos = searchResults.items.filter(item => item.type === 'video');
        
        if (videos.length === 0) {
            throw new Error('No videos found for this search query.');
        }
        
        return videos.slice(0, limit).map(video => ({
            title: video.title,
            url: video.url,
            duration: video.duration,
            durationSeconds: parseDuration(video.duration),
            thumbnail: video.bestThumbnail?.url,
            author: video.author?.name,
            views: video.views,
            requestedBy: null
        }));
    } catch (error) {
        throw new Error(`Search failed: ${error.message}`);
    }
}

/**
 * Formats duration from seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

/**
 * Parses duration string (MM:SS or HH:MM:SS) to seconds
 */
function parseDuration(duration) {
    if (!duration || duration === 'N/A') return 0;
    
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
}

/**
 * Validates song duration (optional limit)
 */
function validateDuration(durationSeconds, maxDuration = 3600) { // 1 hour default
    if (durationSeconds > maxDuration) {
        throw new Error(`Song is too long! Maximum duration is ${formatDuration(maxDuration)}.`);
    }
    return true;
}

/**
 * Creates a progress bar for currently playing song
 */
function createProgressBar(currentTime, totalTime, length = 20) {
    const progress = Math.round((currentTime / totalTime) * length);
    const emptyProgress = length - progress;
    
    const progressText = '▰'.repeat(progress);
    const emptyProgressText = '▱'.repeat(emptyProgress);
    
    return progressText + emptyProgressText;
}

/**
 * Truncates text to specified length
 */
function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

module.exports = {
    isYouTubeURL,
    isYouTubePlaylist,
    getVideoInfo,
    searchYouTube,
    formatDuration,
    parseDuration,
    validateDuration,
    createProgressBar,
    truncateText
};
