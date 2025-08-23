# 🎵 Discord Music Bot

<div align="center">

![Discord Music Bot](https://img.shields.io/badge/Discord-Music%20Bot-7289da?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-43853d?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

</div>

A **feature-rich Discord music bot** built with Discord.js v14 that can play music from YouTube with high-quality audio, advanced queue management, playlist support, and many more exciting features!

## ✨ Features

- 🎵 **High-Quality Audio**: Supports high-quality audio streaming from YouTube
- 📋 **Advanced Queue System**: Queue management with shuffle, loop, and clear functions
- 🔊 **Volume Control**: Adjustable volume (1-100%) with bass boost
- 🔄 **Loop Modes**: Loop single songs or entire queue
- 🔍 **Smart Search**: Search YouTube with interactive song selection
- ⏯️ **Playback Controls**: Play, pause, resume, skip, stop, seek
- 📋 **Playlist Support**: Full YouTube playlist importing
- 🎤 **Lyrics Integration**: Fetch lyrics for any song
- 🎛️ **Audio Filters**: Bass boost, nightcore, vaporwave effects
- 🎯 **User-Friendly**: Rich embeds and intuitive commands
- 🛡️ **Error Handling**: Comprehensive error handling and auto-disconnect
- 🔧 **Easy Setup**: Simple configuration with environment variables

## 🎮 Commands

### Playback Commands
- `!play <song>` - Play a song from YouTube
- `!playlist <url>` - Play a YouTube playlist
- `!pause` - Pause the current song
- `!resume` - Resume the paused song
- `!skip` - Skip the current song
- `!stop` - Stop music and disconnect
- `!seek <time>` - Seek to specific time (MM:SS or seconds)

### Queue Commands
- `!queue` - Show the music queue
- `!nowplaying` - Show current song info
- `!shuffle` - Shuffle the queue
- `!clear` - Clear the queue
- `!remove <position>` - Remove song from queue

### Settings Commands
- `!volume <1-100>` - Change/check volume
- `!loop [song|queue|off]` - Toggle loop modes
- `!search <query>` - Search for songs with interactive selection
- `!filters <name>` - Apply audio filters (bassboost, nightcore, vaporwave)
- `!bassboost` - Quick toggle bass boost

### Extra Commands
- `!lyrics [song]` - Get lyrics for current or specified song
- `!help` - Show all commands
- `!help <command>` - Get detailed command info

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16.0.0 or higher
- A Discord application with bot token
- ffmpeg (for audio processing)

### 1. Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token
5. Enable "Message Content Intent" in bot settings
6. Invite bot to your server with appropriate permissions

### 2. Bot Installation
1. Clone or download this project
2. Navigate to the Music_Bot directory
3. Copy `.env.example` to `.env`
4. Edit `.env` and add your bot token:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   PREFIX=!
   DEFAULT_VOLUME=50
   MAX_QUEUE_SIZE=100
   ```

### 3. Install Dependencies
Run one of these commands:
```bash
npm install
```

### 4. Start the Bot
**Windows:**
- Double-click `start.bat`, or
- Run `start.ps1` in PowerShell

**Manual start:**
```bash
npm start
```

## 🔧 Configuration

Edit the `.env` file to customize bot settings:

- `DISCORD_TOKEN` - Your Discord bot token (required)
- `CLIENT_ID` - Your Discord application ID (required)
- `PREFIX` - Command prefix (default: !)
- `DEFAULT_VOLUME` - Default volume percentage (default: 50)
- `MAX_QUEUE_SIZE` - Maximum songs in queue (default: 100)

## 🎯 Required Bot Permissions

When inviting the bot, make sure it has these permissions:
- Read Messages
- Send Messages
- Connect (to voice channels)
- Speak (in voice channels)
- Use Slash Commands (optional)

## 🔧 Troubleshooting

### Common Issues

**Bot doesn't respond to commands:**
- Check if the bot is online
- Verify the command prefix in `.env`
- Ensure the bot has "Message Content Intent" enabled

**Audio issues:**
- Ensure ffmpeg is installed and in PATH
- Check if the bot has "Connect" and "Speak" permissions
- Verify you're in a voice channel when using music commands

**Installation errors:**
- Update Node.js to version 16.0.0 or higher
- Run `npm install` to install dependencies
- Check if all environment variables are set correctly

### Dependencies
- `discord.js` - Discord API wrapper
- `@discordjs/voice` - Voice connection handling
- `ytdl-core` - YouTube video downloading
- `ytsr` - YouTube search functionality
- `ytpl` - YouTube playlist support
- `ffmpeg-static` - Audio processing

## 📝 Notes

- The bot will automatically disconnect from voice channels if left alone for 30 seconds
- Maximum song duration and queue size can be configured
- The bot supports YouTube URLs and search queries
- All music is streamed in real-time (not downloaded)

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all configuration settings
3. Ensure all dependencies are installed
4. Check Discord bot permissions

## 🔧 Advanced Configuration

### Environment Variables
```env
DISCORD_TOKEN=your_bot_token_here          # Required: Your Discord bot token
CLIENT_ID=your_bot_client_id_here          # Required: Your Discord application ID
PREFIX=!                                   # Optional: Command prefix (default: !)
DEFAULT_VOLUME=50                          # Optional: Default volume (default: 50)
MAX_QUEUE_SIZE=100                         # Optional: Max songs per queue (default: 100)
YOUTUBE_API_KEY=your_youtube_api_key       # Optional: For enhanced search results
```

### Hosting Options
- **Local Hosting**: Run on your computer using the provided scripts
- **VPS/Cloud**: Deploy on services like DigitalOcean, AWS, or Google Cloud
- **Railway**: Easy deployment with automatic scaling
- **Heroku**: Simple cloud hosting (may have limitations)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
1. Clone your fork: `git clone https://github.com/your-username/discord-music-bot.git`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Configure your bot token in `.env`
5. Start development: `npm run dev`

## 📊 Bot Statistics

- **📋 Commands**: 20+ comprehensive music commands
- **🎵 Features**: Queue management, playlists, filters, lyrics, and more
- **⚡ Performance**: Handles multiple servers with efficient resource usage
- **🔧 Dependencies**: Latest Discord.js v14 with voice support

## 📜 Changelog

### v1.0.0 (Latest)
- ✅ Initial release with full feature set
- ✅ YouTube playlist support (up to 50 songs)
- ✅ Interactive search with selection menus
- ✅ Audio filters: bass boost, nightcore, vaporwave
- ✅ Lyrics integration with automatic fallbacks
- ✅ Comprehensive queue management
- ✅ Real-time statistics and monitoring
- ✅ Cross-platform startup scripts
- ✅ Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Powerful Discord API library
- [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube download functionality  
- [ytsr](https://github.com/TimeForANinja/node-ytsr) - YouTube search capabilities
- [ytpl](https://github.com/TimeForANinja/node-ytpl) - YouTube playlist support
- [FFmpeg](https://ffmpeg.org/) - Audio processing capabilities
- The Discord.js community for excellent documentation and support

---

<div align="center">

**Made with ❤️ for the Discord community**

**⭐ Star this repo if you found it helpful! ⭐**

**🎵 Enjoy your music! 🎵**

</div>
