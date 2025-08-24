const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { searchYouTube, truncateText } = require('../utils/musicUtils');

module.exports = {
    name: 'search',
    aliases: ['find'],
    description: 'Search for songs on YouTube',
    usage: 'search <query>',
    async execute(message, args, client) {
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Please provide a search query!')
                .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
            return message.reply({ embeds: [embed] });
        }
        
        const query = args.join(' ');
        
        try {
            // Send info message about search functionality
            const infoEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('🔍 Search Information')
                .setDescription('**Search functionality is currently simplified.**\n\nFor best results, please use the `play` command with:\n• Direct YouTube URLs\n• Specific song names (may work with some songs)')
                .addFields(
                    { name: '✅ Recommended', value: '`!play https://youtube.com/watch?v=...`', inline: false },
                    { name: '⚠️ May Work', value: '`!play Never Gonna Give You Up`', inline: false },
                    { name: '💡 Tip', value: 'Copy YouTube URLs for best reliability!', inline: false }
                );
            
            return message.reply({ embeds: [infoEmbed] });
            
            /* 
            // The old search code is commented out until YouTube API is set up
            const results = await searchYouTube(query, 10);
            
            if (results.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No results found for your search!');
                return searchMessage.edit({ embeds: [embed] });
            }
            
            // ... rest of search implementation
            */
            
        } catch (error) {
            console.error('Search command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Search Error')
                .setDescription(`Failed to search: ${error.message}`);
            
            message.reply({ embeds: [errorEmbed] });
        }
    }
};
