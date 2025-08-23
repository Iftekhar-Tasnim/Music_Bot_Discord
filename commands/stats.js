const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'stats',
    aliases: ['statistics', 'botinfo', 'info'],
    description: 'Show bot statistics and information',
    async execute(message, args, client) {
        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime) % 60;
        
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        
        // Memory usage
        const memoryUsage = process.memoryUsage();
        const memoryUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100;
        const memoryTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100;
        
        // System info
        const cpuUsage = Math.round(os.loadavg()[0] * 100) / 100;
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100;
        const freeMemory = Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100;
        
        // Bot statistics
        const totalGuilds = client.guilds.cache.size;
        const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
        const totalVoiceConnections = client.queues.size;
        const totalActiveSongs = Array.from(client.queues.values()).filter(queue => queue.isPlaying).length;
        
        // Calculate total songs in all queues
        const totalSongsQueued = Array.from(client.queues.values())
            .reduce((total, queue) => total + queue.songs.length + (queue.currentSong ? 1 : 0), 0);
        
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('📊 Bot Statistics')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: '🤖 Bot Info',
                    value: [
                        `**Name:** ${client.user.tag}`,
                        `**ID:** ${client.user.id}`,
                        `**Created:** <t:${Math.floor(client.user.createdTimestamp / 1000)}:R>`,
                        `**Uptime:** ${uptimeString}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '📈 Usage Statistics',
                    value: [
                        `**Servers:** ${totalGuilds.toLocaleString()}`,
                        `**Users:** ${totalUsers.toLocaleString()}`,
                        `**Voice Connections:** ${totalVoiceConnections}`,
                        `**Active Players:** ${totalActiveSongs}`,
                        `**Songs Queued:** ${totalSongsQueued}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '💻 System Info',
                    value: [
                        `**Platform:** ${os.platform()} ${os.arch()}`,
                        `**Node.js:** ${process.version}`,
                        `**CPU Load:** ${cpuUsage}%`,
                        `**RAM Usage:** ${memoryUsed}MB / ${memoryTotal}MB`,
                        `**System RAM:** ${(totalMemory - freeMemory).toFixed(1)}GB / ${totalMemory}GB`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '📚 Dependencies',
                    value: [
                        `**discord.js:** v${require('discord.js').version}`,
                        `**@discordjs/voice:** v${require('@discordjs/voice').version || 'Unknown'}`,
                        `**Node.js:** ${process.version}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '🔗 Links',
                    value: [
                        `[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=3165184&scope=bot)`,
                        `[Support Server](https://discord.gg/your-support-server)`,
                        `[GitHub](https://github.com/your-repo)`
                    ].join('\n'),
                    inline: true
                }
            )
            .setFooter({ 
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL() 
            })
            .setTimestamp();
        
        // Add current guild specific stats if in a guild
        if (message.guild) {
            const guildQueue = client.queues.get(message.guild.id);
            const guildStats = [
                `**Members:** ${message.guild.memberCount.toLocaleString()}`,
                `**Music Queue:** ${guildQueue ? `${guildQueue.songs.length + (guildQueue.currentSong ? 1 : 0)} songs` : 'None'}`,
                `**Currently Playing:** ${guildQueue?.isPlaying ? '✅' : '❌'}`
            ].join('\n');
            
            embed.addFields({
                name: `🏠 ${message.guild.name} Stats`,
                value: guildStats,
                inline: false
            });
        }
        
        message.reply({ embeds: [embed] });
    }
};
