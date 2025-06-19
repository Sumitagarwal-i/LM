const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');
const Mercury = require('@postlight/mercury-parser');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
// const PORT = 3002;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/getTranscript', async (req, res) => {
  try {
    const { videoId } = req.query;

    if (!videoId) {
      return res.status(400).json({
        error: 'Missing videoId',
        example: '/getTranscript?videoId=dQw4w9WgXcQ'
      });
    }

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptItems?.length) {
      return res.status(404).json({
        error: 'Transcript not available',
        videoId
      });
    }

    const transcript = transcriptItems.map(item => item.text).join(' ');

    res.json({
      success: true,
      videoId,
      transcript,
      segments: transcriptItems.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Transcript fetch error:', error.message);
    const videoId = req.query.videoId;

    if (error.message.includes('Could not get transcripts')) {
      return res.status(404).json({ error: 'Transcript not available', videoId });
    }

    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ error: 'Video unavailable', videoId });
    }

    res.status(500).json({ error: 'Internal server error', videoId });
  }
});

app.post('/api/scrapeAndSummarize', async (req, res) => {

  console.log('📥 Received scrape request headers:', req.headers);
  console.log('📥 Received scrape request body:', req.body);
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in request body' });
  }

  try {
    let parsed = await Mercury.parse(url);
    let content = parsed?.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
    let title = parsed?.title || '';
    let excerpt = parsed?.excerpt || '';
    let lead_image_url = parsed?.lead_image_url || '';

   // Fallback to cheerio if Mercury failed or returned poor content
if (!content || content.length < 200) {
  console.warn('⚠️ Mercury content too short, falling back to cheerio...');
  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Referer': url
    }
  });

  const $ = cheerio.load(html);
  title = title || $('title').text();
  excerpt = excerpt || $('meta[name="description"]').attr('content') || '';
  content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 7000);
}


    const prompt = `You are an expert summarizer. Given this article, generate a useful summary:\n\nTitle: ${title}\nExcerpt: ${excerpt}\n\nContent:\n${content}\n\nRespond with the following structure:\n\n**Overview**\n- Topic summary\n\n**Key Points**\n- Main insights\n\n**Relevance**\n- Who should read this and why`;

    const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'Respond only with the summary. No extra commentary.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const summary = groqRes.data.choices[0]?.message?.content || 'Summary unavailable';

    res.json({
      success: true,
      summary,
      metadata: { title, excerpt, lead_image_url }
    });

  } catch (err) {
    console.error('❌ Error in scrapeAndSummarize:', err.message);
    res.status(500).json({
      error: 'Failed to scrape and summarize',
      message: err.message
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /getTranscript?videoId=VIDEO_ID',
      'POST /scrapeAndSummarize'
    ]
  });
});

// // Remove app.listen for Vercel compatibility
// app.listen(PORT, () => {
//   console.log(`🚀 API running at http://localhost:${PORT}`);
// });

// Export the handler for Vercel
module.exports = app; // ✅ This is enough for Vercel
