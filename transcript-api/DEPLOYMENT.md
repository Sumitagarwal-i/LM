# YouTube Transcript API - Deployment Guide

This guide covers deploying the YouTube Transcript API to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd transcript-api
   vercel
   ```

3. **Set environment variables** (if needed):
   ```bash
   vercel env add PORT
   ```

### Option 2: Railway

1. **Connect GitHub repository**
2. **Deploy automatically** from the `transcript-api` folder
3. **Get the deployment URL** from Railway dashboard

### Option 3: Render

1. **Create new Web Service**
2. **Connect GitHub repository**
3. **Set build command**: `npm install`
4. **Set start command**: `npm start`
5. **Deploy**

### Option 4: Heroku

1. **Create Procfile**:
   ```
   web: node server.js
   ```

2. **Deploy**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## 🔧 Environment Variables

- `PORT`: Server port (optional, defaults to 3002)

## 📝 Update Supabase Configuration

After deploying, update your Supabase Edge Function environment:

1. **Go to Supabase Dashboard**
2. **Navigate to Settings > Edge Functions**
3. **Add environment variable**:
   - Key: `TRANSCRIPT_API_URL`
   - Value: `https://your-deployed-api.vercel.app` (or your deployment URL)

## 🧪 Testing Deployment

Test your deployed API:

```bash
# Health check
curl https://your-api-url.vercel.app/health

# Transcript test
curl "https://your-api-url.vercel.app/getTranscript?videoId=dQw4w9WgXcQ"
```

## 🔍 Monitoring

- **Health endpoint**: `GET /health`
- **Logs**: Check your hosting platform's logs
- **Uptime**: Use monitoring services like UptimeRobot

## 🛡️ Security Considerations

- **CORS**: Already configured for cross-origin requests
- **Rate Limiting**: Consider adding rate limiting for production
- **Input Validation**: Video ID validation implemented
- **Error Handling**: Comprehensive error responses

## 📊 Performance

- **Cold Start**: ~1-2 seconds on Vercel
- **Response Time**: ~2-5 seconds for transcript retrieval
- **Memory Usage**: ~50-100MB per request

## 🔄 Updates

To update the deployed API:

1. **Push changes** to your repository
2. **Redeploy** automatically (Vercel/Railway) or manually
3. **Test** the new deployment
4. **Update** Supabase environment variable if needed 