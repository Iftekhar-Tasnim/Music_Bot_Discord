require('dotenv').config();

module.exports = {
    // Discord Configuration
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    
    // Bot Settings
    prefix: process.env.PREFIX || '!',
    defaultVolume: parseInt(process.env.DEFAULT_VOLUME) || 50,
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE) || 100,
    
    // YouTube API (optional)
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    
    // Audio Settings
    audioOptions: {
        highWaterMark: 1 << 25,
        quality: 'highestaudio',
        filter: 'audioonly'
    },
    
    // Voice Connection Settings
    voiceConnectionOptions: {
        selfDeaf: true,
        selfMute: false
    }
};
