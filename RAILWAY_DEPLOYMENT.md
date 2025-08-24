# 🚂 Railway Deployment Guide

## 🔧 Quick Fix for @discordjs/opus Errors

If you're getting `@discordjs/opus` compilation errors, follow these steps:

### Step 1: Verify Files ✅
Ensure these files exist in your project:
- `package.json` (without `@discordjs/opus`)
- `package-lock.json` (generated fresh)
- `Dockerfile`
- `railway.json`
- `.npmrc`

### Step 2: Force Railway to Use Dockerfile 🐳

1. **In Railway Dashboard:**
   - Go to your service settings
   - Navigate to "Source" or "Deploy" settings
   - Ensure "Builder" is set to "Dockerfile"
   - If it shows "Nixpacks", change it to "Dockerfile"

2. **Alternative: Delete and Redeploy**
   - Delete the current Railway service
   - Create a new service
   - Connect to your GitHub repo
   - Railway should auto-detect the Dockerfile

### Step 3: Set Environment Variables 🔑
In Railway Dashboard, set these variables:
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
PREFIX=!
DEFAULT_VOLUME=50
```

### Step 4: Force Fresh Deployment 🔄
1. Make a small change to any file (add a comment)
2. Commit and push to trigger new deployment
3. OR use Railway CLI: `railway redeploy`

## 📋 Dependency Changes Made

### ❌ Removed (Problematic)
- `@discordjs/opus` → Requires native compilation
- `ytdl-core` → Deprecated and broken
- `ytsr` → Deprecated and broken
- `ytpl` → Deprecated and broken

### ✅ Added (Working Alternatives)
- `opusscript` → Pure JS Opus implementation
- `@distube/ytdl-core` → Maintained ytdl fork
- `play-dl` → Modern YouTube search/download

## 🐳 Dockerfile Features

- **Node.js 18.x**: Stable and well-supported
- **Build Tools**: Python, make, g++ for any native deps
- **FFmpeg**: Audio processing
- **Security**: Non-root user
- **Optimized**: Multi-stage build with clean layers

## 🚨 If Still Having Issues

### Option A: Force Clean Build
```bash
# In Railway Dashboard
1. Go to Deployments tab
2. Click "..." on latest deployment  
3. Select "Redeploy"
4. Check "Clear build cache"
```

### Option B: Use Railway CLI
```bash
railway login
railway link
railway redeploy --yes
```

### Option C: Manual Verification
Check these files have been updated:
1. `package.json` - no @discordjs/opus
2. `package-lock.json` - fresh generated
3. `.npmrc` - skips optional deps
4. `Dockerfile` - uses proper base image

## 📞 Support

If deployment still fails:
1. Check Railway logs for specific error
2. Verify environment variables are set
3. Ensure Dockerfile is being used (not Nixpacks)
4. Try creating a new Railway service

## 🎯 Expected Result
✅ Successful deployment without opus compilation errors
✅ Bot starts and connects to Discord
✅ All music commands work normally
