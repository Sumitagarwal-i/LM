console.log('=== LinkMage API SERVER STARTED ===');

// This file is identical to the previous api-server.js, just renamed to .cjs for CommonJS compatibility.
const express = require('express');
const unfluff = require('unfluff');
const cors = require('cors');
const dotenv = require('dotenv');
const cheerio = require('cheerio');

dotenv.config();

// Debug: Log environment variables (without exposing the actual key)
console.log('Environment check:');
console.log('- GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
console.log('- GROQ_API_KEY length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);
if (process.env.GROQ_API_KEY) {
  const key = process.env.GROQ_API_KEY;
  console.log('- GROQ_API_KEY starts with:', key.substring(0, 10) + '...');
  console.log('- GROQ_API_KEY ends with:', '...' + key.substring(key.length - 4));
}

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

// Add error handlers to prevent server from crashing
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Test endpoint to check environment
app.get('/api/test-env', (req, res) => {
  res.json({
    groqKeyPresent: !!process.env.GROQ_API_KEY,
    groqKeyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    groqConfigured: !!process.env.GROQ_API_KEY
  });
});

app.post('/api/fetch-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });
    
    console.log('Fetching content from:', url);
    
    // Enhanced content extraction
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000, // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Try multiple extraction methods
    let title = '';
    let text = '';
    let description = '';
    
    // Method 1: Use unfluff
    try {
      const unfluffData = unfluff(html);
      title = unfluffData.title || '';
      text = unfluffData.text || '';
      description = unfluffData.description || '';
    } catch (e) {
      console.log('Unfluff extraction failed, trying manual extraction...');
    }
    
    // Method 2: Manual extraction if unfluff fails
    if (!title || !text) {
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : '';
      
      // Extract meta description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      description = descMatch ? descMatch[1].trim() : '';
      
      // Extract main content using various selectors
      const contentSelectors = [
        'main',
        'article',
        '.content',
        '.post-content',
        '.entry-content',
        '#content',
        '.main-content',
        'body'
      ];
      
      for (const selector of contentSelectors) {
        const contentMatch = html.match(new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'i'));
        if (contentMatch && contentMatch[1].length > 100) {
          // Clean HTML tags and extract text
          text = contentMatch[1]
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          break;
        }
      }
      
      // If still no text, extract from body
      if (!text) {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          text = bodyMatch[1]
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }
    }
    
    // Fallback if still no content
    if (!title && !text) {
      title = 'Web Page';
      text = 'Content could not be extracted from this page.';
      description = 'Unable to extract content from this URL.';
    }
    
    // Limit text length to avoid token limits
    if (text.length > 8000) {
      text = text.substring(0, 8000) + '...';
    }
    
    console.log('Extracted content:', {
      title: title.substring(0, 100) + (title.length > 100 ? '...' : ''),
      textLength: text.length,
      description: description.substring(0, 100) + (description.length > 100 ? '...' : '')
    });
    
    res.json({
      title,
      text,
      description,
    });
  } catch (error) {
    console.error('Content extraction failed:', error.message);
    res.status(500).json({ 
      error: 'Content extraction failed', 
      details: error.message,
      fallback: {
        title: 'Web Page',
        text: 'Unable to extract content from this URL. Please try a different link.',
        description: 'Content extraction failed'
      }
    });
  }
});

app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing url' });
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing from environment variables.');
      return res.status(500).json({ error: 'GROQ_API_KEY is missing from server environment.' });
    }
    
    console.log('Analyzing URL:', url);
    
    // Get the current server port for internal requests
    const serverPort = process.env.PORT || 7000;
    const fetchRes = await fetch(`http://localhost:${serverPort}/api/fetch-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    
    if (!fetchRes.ok) {
      console.error('Failed to fetch URL content:', fetchRes.status);
      // Return fallback actions instead of error
      const fallbackActions = [
        {
          title: "Analyze URL Structure",
          description: "Analyze the URL structure and domain to understand the content type",
          prompt: "Based on the URL structure and domain, what type of content is this likely to be?"
        },
        {
          title: "Generate General Actions",
          description: "Suggest common actions that could be useful for any web content",
          prompt: "What are some general useful actions someone might want to perform with web content?"
        },
        {
          title: "Extract Key Information",
          description: "Try to extract any available information from the URL itself",
          prompt: "What information can we extract from this URL structure and domain?"
        }
      ];
      return res.json(fallbackActions);
    }
    
    const { title, text, description } = await fetchRes.json();
    
    // Check if we have meaningful content
    if (!title || !text || text.length < 10) {
      console.log('Insufficient content extracted, using fallback actions');
      const fallbackActions = [
        {
          title: "URL Analysis",
          description: "Analyze the URL structure and domain information",
          prompt: "Analyze this URL and explain what type of content it likely contains"
        },
        {
          title: "Domain Research",
          description: "Research the domain and suggest potential content types",
          prompt: "What can we learn about this domain and what content it might contain?"
        },
        {
          title: "General Web Actions",
          description: "Suggest common actions for web content",
          prompt: "What are some useful actions someone might want to perform with web content?"
        }
      ];
      return res.json(fallbackActions);
    }
    
    const prompt = `You are LinkMage. A user pasted a link to a page titled "${title}". Based on the content below, suggest 3 helpful, smart actions the user might perform. 

IMPORTANT: Respond with ONLY valid JSON in this exact format:
[
  { "title": "Action Title", "description": "Action description", "prompt": "Action prompt" }
]

Do not include any other text, markdown, or formatting. Only the JSON array.

Page content:
${text}`;

    console.log('Sending request to Groq API...');
    
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are LinkMage, an expert at suggesting smart actions for any web page. Always respond with valid JSON only. No markdown, no extra text, just the JSON array.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
    });
    
    if (!groqRes.ok) {
      console.error('Groq API error:', groqRes.status, groqRes.statusText);
      throw new Error(`Groq API error: ${groqRes.status}`);
    }
    
    const groqData = await groqRes.json();
    console.log('Groq API response for /api/analyze-url:', JSON.stringify(groqData, null, 2));
    
    let actions = [];
    try {
      const content = groqData.choices?.[0]?.message?.content;
      if (!content) {
        console.error('No content in Groq response:', groqData);
        throw new Error('No content in Groq response');
      }
      
      console.log('Raw content from Groq:', content);
      
      // Try to clean the content before parsing
      let cleanContent = content.trim();
      
      // Remove any markdown code blocks if present
      cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to extract JSON if it's wrapped in other text
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      console.log('Cleaned content for parsing:', cleanContent);
      
      actions = JSON.parse(cleanContent);
      
      // Validate the parsed actions
      if (!Array.isArray(actions)) {
        throw new Error('Parsed content is not an array');
      }
      
      // Validate each action has required fields
      actions = actions.filter(action => {
        if (!action || typeof action !== 'object') {
          console.warn('Invalid action object:', action);
          return false;
        }
        if (!action.title || !action.description || !action.prompt) {
          console.warn('Action missing required fields:', action);
          return false;
        }
        return true;
      });
      
      // If no valid actions, throw error to trigger fallback
      if (actions.length === 0) {
        throw new Error('No valid actions found after filtering');
      }
      
      console.log('Successfully parsed actions:', actions);
      
    } catch (e) {
      console.error('Failed to parse Groq response:', e.message);
      console.error('Raw content was:', groqData.choices?.[0]?.message?.content);
      
      // Return context-aware fallback actions based on the content
      const contentType = title.toLowerCase();
      let fallbackActions = [];
      
      if (contentType.includes('github') || url.includes('github.com')) {
        fallbackActions = [
          {
            title: "Analyze Repository",
            description: "Understand what this GitHub repository does and its purpose",
            prompt: "Analyze this GitHub repository and explain its purpose and functionality"
          },
          {
            title: "Review Code Quality",
            description: "Assess the code quality and suggest improvements",
            prompt: "Review the code quality of this repository and suggest improvements"
          },
          {
            title: "Create Documentation",
            description: "Generate comprehensive documentation for this project",
            prompt: "Create detailed documentation for this GitHub repository"
          }
        ];
      } else if (contentType.includes('blog') || contentType.includes('article')) {
        fallbackActions = [
          {
            title: "Summarize Content",
            description: "Create a concise summary of the main points",
            prompt: "Summarize the key points and main takeaways from this content"
          },
          {
            title: "Extract Insights",
            description: "Identify the most important insights and lessons",
            prompt: "What are the key insights and lessons from this content?"
          },
          {
            title: "Generate Discussion Points",
            description: "Create discussion points for further conversation",
            prompt: "What are some interesting discussion points from this content?"
          }
        ];
      } else {
        fallbackActions = [
          {
            title: "Analyze Content",
            description: "Get a detailed analysis of the page content and key insights",
            prompt: "Analyze this content and provide key insights"
          },
          {
            title: "Summarize Information", 
            description: "Create a concise summary of the main points and takeaways",
            prompt: "Summarize the key information from this content"
          },
          {
            title: "Generate Action Items",
            description: "Extract actionable items and next steps from the content",
            prompt: "What are the main action items from this content?"
          }
        ];
      }
      
      actions = fallbackActions;
    }
    
    console.log('Returning actions:', actions.length);
    res.json(actions);
    
  } catch (error) {
    console.error('Error in /api/analyze-url:', error);
    res.status(500).json({ error: 'Action suggestion failed', details: error.message });
  }
});

// Refactored endpoint: Perform selected action with full context
app.post('/api/perform-action', async (req, res) => {
  try {
    const { type, purpose, content, url, action } = req.body;
    if (!action || !action.prompt) return res.status(400).json({ error: 'Missing action or prompt' });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY missing' });

    const prompt = `You are LinkMage, an expert at performing smart, contextual actions for any web page.\n\nPage type: ${type}\nPurpose: ${purpose}\nURL: ${url}\nContent: ${content ? content.substring(0, 2000) : ''}\n\nAction: ${action.title}\nAction description: ${action.description}\n\n${action.prompt}\n\nRespond in clear, readable text. No markdown, no code blocks, just the result.`;

    const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are LinkMage. Respond in clear, readable text. No markdown, no code blocks.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });
    if (!aiRes.ok) return res.status(500).json({ error: 'AI request failed' });
    const aiData = await aiRes.json();
    const result = aiData.choices?.[0]?.message?.content?.trim() || '';
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Improved /api/analyze-link with logging and better error messages
app.post('/api/analyze-link', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('[analyze-link] Incoming:', req.body, 'url:', req.body?.url);
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      console.error('[analyze-link] 400: Missing or invalid url:', url);
      return res.status(400).json({ error: 'Missing or invalid url', received: url });
    }
    
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });
    if (!response.ok) {
      return res.status(500).json({ error: `Failed to fetch URL: HTTP ${response.status}` });
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract OpenGraph/meta tags
    const ogType = $('meta[property="og:type"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDesc = $('meta[property="og:description"]').attr('content') || '';
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const title = $('title').text() || ogTitle;
    let mainText = '';

    // Try to extract main content from common selectors
    const selectors = ['article', 'main', '.content', '.post-content', '.entry-content', '#content', '.main-content', 'body'];
    for (const sel of selectors) {
      const text = $(sel).text().replace(/\s+/g, ' ').trim();
      if (text && text.length > 200) {
        mainText = text;
        break;
      }
    }
    // Fallback to body text
    if (!mainText) {
      mainText = $('body').text().replace(/\s+/g, ' ').trim();
    }
    // Fallback to OpenGraph/meta description
    if (!mainText || mainText.length < 100) {
      mainText = ogDesc || metaDesc || '';
    }
    // Limit content length
    if (mainText.length > 8000) mainText = mainText.substring(0, 8000) + '...';

    // AI: Classify type and purpose
    let type = 'unknown';
    let purpose = '';
    if (process.env.GROQ_API_KEY) {
      const aiPrompt = `Analyze the following web page and URL. Respond with valid JSON in this format:\n{\n  "type": "(choose: blog post, GitHub repository, YouTube video, documentation, product page, news article, portfolio, forum post, PDF, tweet, unknown)",\n  "purpose": "(one sentence summary of the page's purpose)"\n}\n\nURL: ${url}\nTitle: ${title}\nContent: ${mainText.substring(0, 1000)}`;
      const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: 'You are LinkMage. Always respond with valid JSON only. No extra text.' },
            { role: 'user', content: aiPrompt },
          ],
          max_tokens: 200,
          temperature: 0.1,
        }),
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        let aiContent = aiData.choices?.[0]?.message?.content?.trim() || '';
        aiContent = aiContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const match = aiContent.match(/\{[\s\S]*\}/);
        if (match) aiContent = match[0];
        try {
          const parsed = JSON.parse(aiContent);
          type = parsed.type || 'unknown';
          purpose = parsed.purpose || '';
        } catch (e) {
          // fallback
        }
      }
    }
    res.json({ type, purpose, content: mainText, url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Improved /api/generate-actions with logging and better error messages
app.post('/api/generate-actions', async (req, res) => {
  try {
    const { type, purpose, content, url } = req.body;
    console.log('[generate-actions] Incoming:', req.body);
    if (!type || typeof type !== 'string' || !content || typeof content !== 'string') {
      console.error('[generate-actions] 400: Missing type or content');
      return res.status(400).json({ error: 'Missing type or content' });
    }
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY missing' });

    const prompt = `You are LinkMage, an expert at suggesting smart, actionable things a user might want to do with a web page.\n\nPage type: ${type}\nPurpose: ${purpose}\nURL: ${url}\nContent: ${content.substring(0, 1000)}\n\nSuggest 3-5 highly relevant, actionable things a user might want to do with this page.\n\nRespond with valid JSON in this format:\n[\n  {\n    "title": "Action title",\n    "description": "What this action does",\n    "prompt": "Prompt to use if the user selects this action"\n  }\n]\n\nNo extra text, only the JSON array.`;

    const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are LinkMage. Always respond with valid JSON only. No extra text.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
    });
    if (!aiRes.ok) return res.status(500).json({ error: 'AI request failed' });
    const aiData = await aiRes.json();
    let aiContent = aiData.choices?.[0]?.message?.content?.trim() || '';
    aiContent = aiContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const match = aiContent.match(/\[[\s\S]*\]/);
    if (match) aiContent = match[0];
    let actions = [];
    try {
      actions = JSON.parse(aiContent);
      if (!Array.isArray(actions)) throw new Error('Not an array');
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI response', details: aiContent });
    }
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to start server with port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
  console.error('Server error:', err);
  process.exit(1);
    }
}); 
  
  return server;
};

startServer(PORT); 