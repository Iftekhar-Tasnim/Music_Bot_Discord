# 🔧 Troubleshooting Guide

This guide helps you resolve common issues with the Discord Music Bot.

## 🚨 Common Issues and Solutions

### Bot Not Responding to Commands

#### Problem: Bot doesn't respond to any commands
**Possible Causes:**
- Bot is offline
- Wrong command prefix
- Missing permissions
- Bot token is invalid

**Solutions:**
1. **Check bot status**: Ensure bot is online in Discord
2. **Verify prefix**: Check your `.env` file for the correct PREFIX value
3. **Check token**: Ensure DISCORD_TOKEN in `.env` is correct and valid
4. **Bot permissions**: Ensure bot has "Read Messages" and "Send Messages" permissions
5. **Message Content Intent**: Enable in Discord Developer Portal -> Bot -> Privileged Gateway Intents

#### Problem: Some commands work but others don't
**Solutions:**
1. Check console for error messages
2. Ensure all dependencies are installed: `npm install`
3. Restart the bot: `npm start`

### Voice Connection Issues

#### Problem: Bot can't join voice channels
**Error Messages:**
- "I need permissions to join and speak in your voice channel!"
- "Connection timeout"

**Solutions:**
1. **Check permissions**: Bot needs "Connect" and "Speak" permissions
2. **Voice channel limit**: Ensure voice channel isn't full
3. **Server region**: Some regions may have connectivity issues
4. **Firewall**: Check if your firewall is blocking voice connections

#### Problem: No audio playback
**Error Messages:**
- "Error playing song"
- Audio starts but no sound

**Solutions:**
1. **FFmpeg installation**: Ensure FFmpeg is properly installed
   ```bash
   # Windows (using chocolatey)
   choco install ffmpeg
   
   # macOS (using homebrew)
   brew install ffmpeg
   
   # Linux (Ubuntu/Debian)
   sudo apt install ffmpeg
   ```
2. **Audio permissions**: Ensure bot has "Speak" permission
3. **Voice channel type**: Bot can't play in stage channels, only voice channels
4. **Server deafened**: Check if bot is server deafened

### Music Playback Issues

#### Problem: "No videos found" or search failures
**Solutions:**
1. **YouTube restrictions**: Some videos may be region-locked or private
2. **Search terms**: Try different search keywords
3. **URL format**: Ensure YouTube URLs are valid
4. **API limits**: If using YouTube API key, check quotas

#### Problem: Songs start but stop immediately
**Solutions:**
1. **Network connectivity**: Check internet connection
2. **ytdl-core updates**: Update dependencies: `npm update`
3. **Age restrictions**: Bot can't play age-restricted content
4. **Copyright**: Some content may be blocked

#### Problem: Poor audio quality or stuttering
**Solutions:**
1. **Server resources**: Check CPU and memory usage
2. **Network bandwidth**: Ensure sufficient internet speed
3. **Audio settings**: Adjust quality in config.js
4. **Buffer size**: Increase audio buffer size in configuration

### Installation and Setup Issues

#### Problem: npm install fails
**Common Errors:**
- "node-gyp errors"
- "Python not found"
- "Visual Studio build tools"

**Solutions:**
1. **Node.js version**: Ensure Node.js 16.0.0 or higher
2. **Build tools (Windows)**:
   ```bash
   npm install -g windows-build-tools
   ```
3. **Python (Windows)**:
   ```bash
   npm install -g python
   ```
4. **Clean install**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### Problem: Environment configuration errors
**Solutions:**
1. **File location**: Ensure `.env` file is in the root directory
2. **File format**: Check for extra spaces or hidden characters
3. **Token format**: Discord tokens should be exactly as provided (no quotes)
4. **Required fields**: DISCORD_TOKEN and CLIENT_ID are mandatory

### Performance Issues

#### Problem: High memory usage
**Solutions:**
1. **Queue limits**: Reduce MAX_QUEUE_SIZE in configuration
2. **Restart regularly**: Set up automatic restarts for long-running instances
3. **Memory optimization**: Enable MEMORY_OPTIMIZATION in config
4. **Resource monitoring**: Use `!stats` command to monitor usage

#### Problem: Slow response times
**Solutions:**
1. **Server location**: Host closer to your Discord server regions
2. **Network optimization**: Use wired connection instead of WiFi
3. **Concurrent limits**: Reduce MAX_CONCURRENT_DOWNLOADS
4. **Resource allocation**: Increase server CPU/RAM if hosted on VPS

## 🔍 Debugging Steps

### 1. Check Console Output
Always check the console for error messages:
```bash
# Enable debug mode in .env
DEBUG_MODE=true
LOG_LEVEL=debug

# Restart bot and check output
npm start
```

### 2. Test Basic Functionality
```bash
# Test commands in order:
!help          # Should show command list
!ping          # Test basic response (if implemented)
!stats         # Check bot status
!play test     # Test music functionality
```

### 3. Verify Dependencies
```bash
# Check Node.js version
node --version  # Should be 16.0.0+

# Check installed packages
npm list

# Update all dependencies
npm update
```

### 4. Permission Checklist
Bot needs these Discord permissions:
- ✅ View Channels
- ✅ Send Messages
- ✅ Embed Links
- ✅ Read Message History
- ✅ Connect (Voice)
- ✅ Speak (Voice)
- ✅ Use Voice Activity

## 📊 Error Codes and Messages

### Discord.js Errors
| Error Code | Description | Solution |
|------------|-------------|----------|
| 50013 | Missing Permissions | Check bot role permissions |
| 50035 | Invalid Form Body | Check message content/embeds |
| 40001 | Unauthorized | Invalid bot token |
| 50001 | Missing Access | Bot can't access channel |

### Bot-Specific Errors
| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Queue is full" | MAX_QUEUE_SIZE reached | Increase limit or clear queue |
| "Invalid YouTube URL" | Bad URL format | Check URL format |
| "Search failed" | YouTube API issue | Try again or check API key |
| "Connection timeout" | Network/Discord issue | Check connection |

## 🛠️ Advanced Troubleshooting

### Enable Detailed Logging
```javascript
// Add to config.js for more verbose logging
module.exports = {
    // ... existing config
    debug: {
        enabled: true,
        logLevel: 'debug',
        logToFile: true
    }
};
```

### Network Diagnostics
```bash
# Test YouTube connectivity
curl -I "https://www.youtube.com"

# Test Discord connectivity
curl -I "https://discord.com/api/v10/gateway"

# Check DNS resolution
nslookup youtube.com
```

### Resource Monitoring
Use the built-in stats command:
```
!stats
```
Monitor:
- Memory usage
- CPU load
- Active connections
- Queue sizes

## 🆘 Getting Help

### Self-Help Resources
1. **Console logs**: Always check for error messages
2. **Documentation**: Read README.md and command help
3. **Dependencies**: Ensure all packages are up to date
4. **Environment**: Verify .env configuration

### Community Support
1. **GitHub Issues**: Report bugs and get help
2. **Discord Server**: Real-time community support
3. **Discussions**: Ask questions and share solutions

### Before Asking for Help
Please provide:
1. **Error messages**: Full console output
2. **Environment**: OS, Node.js version, npm version
3. **Configuration**: Sanitized .env file (remove tokens)
4. **Steps**: What you were doing when the error occurred
5. **Logs**: Recent console output

## 🔧 Quick Fixes

### Reset Bot Completely
```bash
# Stop bot
Ctrl + C

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset configuration
cp .env.example .env
# Edit .env with your settings

# Restart bot
npm start
```

### Update Everything
```bash
# Update Node.js (download from nodejs.org)

# Update npm
npm install -g npm@latest

# Update bot dependencies
npm update

# Clear npm cache
npm cache clean --force
```

---

**Still having issues?** Create a [GitHub Issue](https://github.com/your-username/discord-music-bot/issues) with detailed information about your problem.
