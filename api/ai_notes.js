// /api/ai_notes.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=59'
  );

  try {
    const { user_id } = req.query;
    
    // Validate user_id for all operations
    if (!user_id) {
      console.error('Missing user_id in request:', { method: req.method, query: req.query });
      return res.status(400).json({ 
        error: 'Missing user_id',
        code: 'VALIDATION_ERROR',
        message: 'user_id is required for all operations'
      });
    }

    if (req.method === 'GET') {
      console.log('Fetching notes for user:', user_id);
      
      const { data, error } = await supabase
        .from('ai_notes')
        .select('*')
        .eq('user_id', user_id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Database error fetching notes:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log(`Successfully fetched ${data?.length || 0} notes for user:`, user_id);
      res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      console.log('Creating note for user:', user_id, 'Body:', req.body);
      
      const { title, content } = req.body;
      
      // Validate required fields
      if (!title || !content) {
        console.error('Missing required fields:', { title: !!title, content: !!content });
        return res.status(400).json({ 
          error: 'Missing title or content',
          code: 'VALIDATION_ERROR',
          message: 'Both title and content are required'
        });
      }

      // Validate field lengths
      if (title.length > 255) {
        return res.status(400).json({ 
          error: 'Title too long',
          code: 'VALIDATION_ERROR',
          message: 'Title must be 255 characters or less'
        });
      }

      if (content.length > 10000) {
        return res.status(400).json({ 
          error: 'Content too long',
          code: 'VALIDATION_ERROR',
          message: 'Content must be 10,000 characters or less'
        });
      }

      const { data, error } = await supabase
        .from('ai_notes')
        .insert([{ 
          title: title.trim(), 
          content: content.trim(), 
          user_id 
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error creating note:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log('Successfully created note:', data.id);
      res.status(201).json(data);
      
    } else {
      console.error('Method not allowed:', req.method);
      res.status(405).json({ 
        error: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
        message: `${req.method} is not supported for this endpoint`
      });
    }
  } catch (err) {
    console.error('Unexpected error in ai_notes API:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
