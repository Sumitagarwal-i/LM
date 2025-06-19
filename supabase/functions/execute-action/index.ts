import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Helper function to fetch YouTube transcript
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // Use the YouTube Transcript API endpoint
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    if (!response.ok) {
      console.log('Failed to fetch YouTube page');
      return null;
    }

    const html = await response.text();
    
    // Extract transcript data from the page
    const transcriptMatch = html.match(/"transcriptRenderer":\s*\{[^}]*"transcriptSearchBoxRenderer":\s*\{[^}]*\}([^}]*)\}/);
    if (!transcriptMatch) {
      console.log('No transcript found in page');
      return null;
    }

    // Try to extract transcript segments
    const segmentsMatch = html.match(/"transcriptSegmentRenderer":\s*\{[^}]*"text":\s*\{[^}]*"runs":\s*\[([^\]]+)\]/g);
    if (!segmentsMatch) {
      console.log('No transcript segments found');
      return null;
    }

    // Parse transcript segments
    const transcript = segmentsMatch
      .map(segment => {
        const textMatch = segment.match(/"text":\s*"([^"]+)"/);
        return textMatch ? textMatch[1] : '';
      })
      .filter(text => text.length > 0)
      .join(' ');

    return transcript.length > 0 ? transcript : null;
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    return null;
  }
}

// Helper function to scrape content
async function scrapeContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 8000,
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract main content
    let cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

    const contentSelectors = ['article', 'main', '.content', '.post-content', '.entry-content', '#content'];
    let content = '';

    for (const selector of contentSelectors) {
      const regex = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, 'i');
      const match = cleanHtml.match(regex);
      if (match && match[1].length > 200) {
        content = match[1];
        break;
      }
    }

    if (!content) {
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      content = bodyMatch ? bodyMatch[1] : '';
    }

    // Clean content
    content = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    if (content.length > 3000) {
      content = content.substring(0, 3000) + '...';
    }

    return { title, description, content };
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { link, action } = await req.json().catch(() => ({}));

    if (!link || !action) {
      return new Response(JSON.stringify({
        error: 'Link and action are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate URL
    try {
      new URL(link);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Executing action for:', link, 'Action:', action);

    // Check if this is a YouTube URL and fetch transcript if needed
    const videoId = extractYouTubeVideoId(link);
    let transcriptContext = '';
    
    if (videoId) {
      console.log('YouTube video detected, checking for transcript...');
      try {
        const transcript = await fetchYouTubeTranscript(videoId);
        if (transcript) {
          console.log('Transcript found, including in context');
          transcriptContext = `
YouTube Video Transcript:
${transcript}

`;
        } else {
          console.log('No transcript available for this video');
          transcriptContext = `
Note: This is a YouTube video but no transcript is available. This could be due to auto-generated captions, private video, or no captions being available.
`;
        }
      } catch (error) {
        console.error('Error fetching YouTube transcript:', error);
        transcriptContext = `
Note: This is a YouTube video but there was an error fetching the transcript.
`;
      }
    }

    // Try to scrape content for better context
    const scrapedContent = await scrapeContent(link);
    
    let contextInfo = '';
    if (scrapedContent && scrapedContent.content) {
      contextInfo = `
Page Title: ${scrapedContent.title || 'Unknown'}
Page Description: ${scrapedContent.description || 'No description available'}
Page Content: ${scrapedContent.content}
`;
    } else {
      contextInfo = `
Note: Unable to scrape page content. Working with URL analysis only.
URL Structure: ${link}
Domain: ${new URL(link).hostname}
`;
    }

    const prompt = `You are LinkMage, an AI assistant that performs intelligent actions on web content.

URL: ${link}
Action to perform: ${action}

${transcriptContext}${contextInfo}

Based on the URL and available content, perform the requested action. Provide specific, actionable, and useful content.

Guidelines:
- Provide specific, actionable, and useful content
- Format your response with clear structure using bold headings and bullet points
- Use **Bold Headings** for main sections
- Use bullet points (•) for lists and key points
- Be practical and realistic about what can be determined
- If the URL suggests specific content (like GitHub repo, blog, product page), tailor your response accordingly
- Make your output immediately useful to the user
- Use clear, professional language
- Structure your response with proper sections and subsections
- If you're working with limited content, be honest about what you can and cannot determine
- For YouTube videos, use the transcript content when available to provide more accurate and detailed analysis

Generate real, practical output for this action with proper formatting:`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are LinkMage, an AI assistant that creates practical, well-formatted content based on URLs and web content. Always provide real, usable output without placeholders. Format content clearly without markdown syntax.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No content generated";

    console.log('Action execution completed for:', link);

    return new Response(JSON.stringify({
      content,
      url: link,
      action: action,
      hasScrapedContent: !!scrapedContent?.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in execute-action function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
