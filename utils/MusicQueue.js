const { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { EventEmitter } = require('events');
const ytdl = require('ytdl-core');
const config = require('../config');

class MusicQueue extends EventEmitter {
    constructor(guild) {
        super();
        this.guild = guild;
        this.songs = [];
        this.currentSong = null;
        this.player = createAudioPlayer();
        this.connection = null;
        this.volume = config.defaultVolume;
        this.loop = false;
        this.loopQueue = false;
        this.isPlaying = false;
        this.bassBoost = false;
        this.bassBoostOriginalVolume = null;
        
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.handleSongEnd();
        });
        
        this.player.on('error', (error) => {
            console.error('Audio player error:', error);
            this.handleSongEnd();
        });
    }
    
    addSong(song) {
        if (this.songs.length >= config.maxQueueSize) {
            throw new Error(`Queue is full! Maximum ${config.maxQueueSize} songs allowed.`);
        }
        this.songs.push(song);
    }
    
    addSongs(songs) {
        if (this.songs.length + songs.length > config.maxQueueSize) {
            throw new Error(`Adding ${songs.length} songs would exceed the queue limit of ${config.maxQueueSize}.`);
        }
        this.songs.push(...songs);
    }
    
    removeSong(index) {
        if (index < 0 || index >= this.songs.length) {
            throw new Error('Invalid song index.');
        }
        return this.songs.splice(index, 1)[0];
    }
    
    clearQueue() {
        this.songs = [];
        this.currentSong = null;
    }
    
    shuffle() {
        for (let i = this.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
        }
    }
    
    async play() {
        if (this.songs.length === 0) {
            this.isPlaying = false;
            return null;
        }
        
        this.currentSong = this.songs.shift();
        this.isPlaying = true;
        
        try {
            // Enhanced audio options with seek support
            const audioOptions = {
                ...config.audioOptions,
                begin: this.currentSong.seekTime ? this.currentSong.seekTime * 1000 : undefined
            };
            
            const stream = ytdl(this.currentSong.url, audioOptions);
            const resource = createAudioResource(stream, {
                inlineVolume: true,
                inputType: 'opus'
            });
            
            resource.volume.setVolume(this.volume / 100);
            this.player.play(resource);
            
            if (this.connection) {
                this.connection.subscribe(this.player);
            }
            
            // Clear seek time after use
            if (this.currentSong.seekTime) {
                delete this.currentSong.seekTime;
            }
            
            return this.currentSong;
        } catch (error) {
            console.error('Error playing song:', error);
            this.handleSongEnd();
            throw error;
        }
    }
    
    pause() {
        this.player.pause();
    }
    
    resume() {
        this.player.unpause();
    }
    
    stop() {
        this.player.stop();
        this.clearQueue();
        this.isPlaying = false;
    }
    
    skip() {
        this.player.stop();
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        if (this.player.state.resource && this.player.state.resource.volume) {
            this.player.state.resource.volume.setVolume(this.volume / 100);
        }
    }
    
    setLoop(enabled) {
        this.loop = enabled;
    }
    
    setLoopQueue(enabled) {
        this.loopQueue = enabled;
    }
    
    handleSongEnd() {
        if (this.loop && this.currentSong) {
            this.songs.unshift(this.currentSong);
        } else if (this.loopQueue && this.currentSong) {
            this.songs.push(this.currentSong);
        }
        
        this.currentSong = null;
        
        if (this.songs.length > 0) {
            setTimeout(() => this.play().catch(console.error), 1000);
        } else {
            this.isPlaying = false;
            // Emit queue end event for potential autoplay
            this.emit?.('queueEnd');
        }
    }
    
    getQueue() {
        return {
            current: this.currentSong,
            upcoming: this.songs.slice(0, 10), // Show first 10 upcoming songs
            total: this.songs.length,
            volume: this.volume,
            loop: this.loop,
            loopQueue: this.loopQueue,
            isPlaying: this.isPlaying
        };
    }
}

module.exports = MusicQueue;
