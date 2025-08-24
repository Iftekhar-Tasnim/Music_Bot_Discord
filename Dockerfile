# Use Node.js 18 LTS (not Alpine to avoid compilation issues)
FROM node:18-slim

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and npm configuration
COPY package.json package-lock.json .npmrc ./

# Install dependencies with clean cache, skipping optional deps
RUN npm ci --only=production --no-optional

# Copy source code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash musicbot
RUN chown -R musicbot:musicbot /app
USER musicbot

# Start the bot
CMD ["node", "index.js"]
