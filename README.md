# LinkMage - AI-Powered Link Analysis

LinkMage is a React application that analyzes any URL and provides AI-powered insights and actionable recommendations. It uses Groq AI for intelligent content analysis and works with various content types including YouTube videos, blog posts, GitHub repositories, and more.

## Features

- **Universal Link Analysis**: Works with any URL type
- **YouTube Content Analysis**: Special handling for YouTube videos with content analysis
- **AI-Powered Actions**: Contextual action suggestions based on content type
- **Multiple Action Sets**: Different action sets for different content types
- **Real-time Processing**: Fast analysis using Groq AI
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## YouTube Content Analysis

LinkMage provides enhanced analysis for YouTube videos using a multi-layered approach that works reliably in Edge Functions:

### How It Works

1. **Video ID Extraction**: Automatically extracts the video ID from YouTube URLs
2. **Content Analysis**: Uses multiple methods to gather video information:
   - YouTube Data API v3 (if API key is provided)
   - Video metadata extraction (title, description, keywords)
   - Simplified HTML parsing for basic content
3. **AI Analysis**: Generates comprehensive content analysis using Groq AI
4. **Fallback Handling**: Always provides useful analysis even when content extraction fails

### Content Analysis Features

- **Automatic Detection**: Detects YouTube videos automatically
- **Content Summary**: Provides detailed analysis of video content
- **Contextual Actions**: YouTube-specific action suggestions
- **Reliable Operation**: Works in Edge Functions without browser dependencies

### YouTube API Integration (Optional)

For enhanced analysis, you can add a YouTube Data API key:

1. Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add it to your Supabase secrets as `YOUTUBE_API_KEY`
3. The system will automatically use it for better content extraction

## Content Types Supported

- **YouTube Videos**: Video content analysis and summaries
- **Blog Posts**: Article summaries and key takeaways
- **GitHub Repositories**: Project analysis and documentation
- **Product Pages**: Feature analysis and comparisons
- **News Articles**: News summaries and fact extraction
- **Documentation**: Quick start guides and key concepts
- **Portfolios**: Project showcase analysis
- **And more...**

## Action Types

Each content type has specialized actions:

### YouTube Videos
- Video Summary
- Key Points Extraction
- Deep Analysis
- Discussion Questions
- Related Topics
- Social Media Content

### Blog Posts
- Article Summarization
- Key Takeaways
- Tweet Thread Generation
- Professional Email Creation
- Pros and Cons Analysis

### GitHub Repositories
- Project Explanation
- Installation Guide
- Tech Stack Summary
- README Generation
- Code Review Points
- Learning Path Creation

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Vite** for build tooling

### Backend
- **Supabase Edge Functions** (Deno)
- **Groq AI** for content analysis
- **YouTube Data API** (optional)
- **Robust error handling**

### Key Features
- **Edge Function Compatible**: No browser dependencies
- **Multi-layered Fallbacks**: Always provides useful results
- **TypeScript Support**: Full type safety
- **CORS Handling**: Cross-origin request support
- **Error Recovery**: Graceful handling of API failures

## Setup and Installation

### Prerequisites
- Node.js 18+
- Supabase account
- Groq AI API key

### Environment Variables
```bash
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key  # Optional
```

### Installation Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase Edge Functions
4. Configure environment variables
5. Deploy to Supabase

## Usage

1. **Paste a URL**: Enter any URL in the input field
2. **Auto-Analysis**: The system automatically detects content type
3. **Manual Selection**: Optionally select content type manually
4. **View Analysis**: See content type, purpose, and available actions
5. **Execute Actions**: Click on actions to generate AI-powered content
6. **Load More**: Access additional action sets for more options

## YouTube-Specific Features

### Content Analysis
- Automatically analyzes YouTube video content
- Provides comprehensive summaries and insights
- Works with public videos, descriptions, and metadata
- Handles private or restricted content gracefully

### Action Sets
- **Set 1**: Video Summary, Key Points, Deep Analysis
- **Set 2**: Discussion Questions, Related Topics, Social Media Posts

### Error Handling
- Graceful fallback when content extraction fails
- Clear error messages for users
- Always provides useful analysis even with limited data

## Development

### Local Development
```bash
npm run dev
```

### Testing
```bash
npm run test
```

### Building
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Note**: The YouTube content analysis is designed to work reliably in Edge Functions without requiring browser-based libraries like `youtube-transcript`. It uses a combination of API calls, metadata extraction, and AI analysis to provide comprehensive video insights.
