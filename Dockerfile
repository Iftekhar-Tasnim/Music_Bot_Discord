# Use Node.js 18 LTS Alpine image for smaller size
FROM node:18-alpine

# Install necessary packages for audio processing
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S musicbot -u 1001

# Change ownership to non-root user
RUN chown -R musicbot:nodejs /app
USER musicbot

# Expose port (Railway will set PORT env variable)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Start the bot
CMD ["node", "index.js"]
