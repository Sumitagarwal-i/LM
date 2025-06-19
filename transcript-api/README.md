# YouTube Transcript API

A lightweight Node.js API for retrieving YouTube video transcripts using the `youtube-transcript` package.

## Features

- ✅ **Reliable Transcript Retrieval**: Uses the `youtube-transcript` npm package
- ✅ **CORS Enabled**: Works with frontend applications
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Health Check**: Monitoring endpoint
- ✅ **Production Ready**: Ready for deployment on Vercel, Railway, or Render

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Test the API**:
   ```bash
   curl "http://localhost:3002/getTranscript?videoId=dQw4w9WgXcQ"
   ```

### Deployment

This API can be deployed to any Node.js hosting service:

- **Vercel**: Add `vercel.json` configuration
- **Railway**: Connect GitHub repository
- **Render**: Deploy from GitHub
- **Heroku**: Use Procfile

## API Endpoints

### GET /getTranscript

Retrieves the transcript for a YouTube video.

**Parameters**:
- `videoId` (required): YouTube video ID

**Example Request**:
```
GET /getTranscript?videoId=dQw4w9WgXcQ
```

**Success Response** (200):
```json
{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "transcript": "Never gonna give you up, never gonna let you down...",
  "segments": 45,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:

- **400 Bad Request**: Missing videoId parameter
- **404 Not Found**: Transcript not available or video not found
- **500 Internal Server Error**: Server error

### GET /health

Health check endpoint for monitoring.

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Environment Variables

- `PORT`: Server port (default: 3002)

## Integration with LinkMage

This API is designed to work with the LinkMage Supabase Edge Functions. The Edge Function will call this API to retrieve transcripts, then use Groq AI to summarize them.

## Error Handling

The API handles various error scenarios:

- **No transcript available**: Returns 404 with clear message
- **Video not found**: Returns 404 with appropriate message
- **Invalid video ID**: Returns 400 with validation error
- **Server errors**: Returns 500 with generic error message

## Security

- CORS enabled for cross-origin requests
- Input validation for video IDs
- Error messages don't expose internal details
- Rate limiting can be added if needed

## Monitoring

Use the `/health` endpoint for:
- Health checks
- Load balancer health checks
- Monitoring services
- Uptime monitoring 