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
            // Send searching message
            const searchEmbed = new EmbedBuilder()
                .setColor('#FFFF00')
                .setDescription('🔍 Searching YouTube...');
            const searchMessage = await message.reply({ embeds: [searchEmbed] });
            
            // Search for videos
            const results = await searchYouTube(query, 10);
            
            if (results.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No results found for your search!');
                return searchMessage.edit({ embeds: [embed] });
            }
            
            // Create embed with search results
            const embed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('🔍 Search Results')
                .setDescription(`Found ${results.length} results for: **${query}**`)
                .setTimestamp();
            
            // Add first 5 results to embed
            results.slice(0, 5).forEach((result, index) => {
                embed.addFields({
                    name: `${index + 1}. ${truncateText(result.title, 40)}`,
                    value: `Duration: ${result.duration} | Author: ${result.author}`,
                    inline: false
                });
            });
            
            // Create select menu for song selection
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('song_select')
                .setPlaceholder('Choose a song to play...')
                .addOptions(
                    results.map((result, index) => ({
                        label: truncateText(result.title, 100),
                        description: `${result.duration} - ${result.author}`,
                        value: result.url,
                        emoji: '🎵'
                    }))
                );
            
            const row = new ActionRowBuilder().addComponents(selectMenu);
            
            await searchMessage.edit({ 
                embeds: [embed], 
                components: [row] 
            });
            
            // Create collector for menu interaction
            const collector = searchMessage.createMessageComponentCollector({
                time: 30000 // 30 seconds
            });
            
            collector.on('collect', async (interaction) => {
                if (interaction.user.id !== message.author.id) {
                    return interaction.reply({ 
                        content: '❌ Only the person who used the search command can select a song!', 
                        ephemeral: true 
                    });
                }
                
                await interaction.deferUpdate();
                
                // Simulate play command with selected URL
                const playCommand = client.commands.get('play');
                if (playCommand) {
                    await playCommand.execute(message, [interaction.values[0]], client);
                }
                
                // Remove the select menu
                await searchMessage.edit({ components: [] });
                collector.stop();
            });
            
            collector.on('end', async () => {
                // Remove components when collector expires
                try {
                    await searchMessage.edit({ components: [] });
                } catch (error) {
                    // Message might have been deleted
                }
            });
            
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
