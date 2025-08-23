const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    aliases: ['vol', 'v'],
    description: 'Change or check the music volume',
    usage: 'volume [1-100]',
    async execute(message, args, client) {
        const queue = client.queues.get(message.guild.id);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ There is no music queue for this server!');
            return message.reply({ embeds: [embed] });
        }
        
        // Check if user is in the same voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== queue.connection.joinConfig.channelId) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ You need to be in the same voice channel as the bot!');
            return message.reply({ embeds: [embed] });
        }
        
        // If no volume provided, show current volume
        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#0099FF')
                .setTitle('🔊 Current Volume')
                .setDescription(`Volume is currently set to **${queue.volume}%**`)
                .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
            return message.reply({ embeds: [embed] });
        }
        
        const newVolume = parseInt(args[0]);
        
        if (isNaN(newVolume) || newVolume < 1 || newVolume > 100) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ Volume must be a number between 1 and 100!')
                .addFields({ name: 'Usage', value: `\`${this.usage}\`` });
            return message.reply({ embeds: [embed] });
        }
        
        const oldVolume = queue.volume;
        queue.setVolume(newVolume);
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔊 Volume Changed')
            .setDescription(`Volume changed from **${oldVolume}%** to **${newVolume}%**`);
        
        message.reply({ embeds: [embed] });
    }
};
