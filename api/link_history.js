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

  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=59');

  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      
      if (!user_id) {
        console.error('Missing user_id in GET request:', { query: req.query });
        return res.status(400).json({ 
          error: 'Missing user_id',
          code: 'VALIDATION_ERROR',
          message: 'user_id is required for fetching history'
        });
      }

      console.log('Fetching history for user:', user_id);

      const { data, error } = await supabase
        .from('link_history')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error fetching history:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log(`Successfully fetched ${data?.length || 0} history items for user:`, user_id);
      res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      const { user_id, link, title, content_type, summary, analysis_data } = req.body;
      
      if (!user_id || !link) {
        console.error('Missing required fields for history creation:', { 
          user_id: !!user_id, 
          link: !!link 
        });
        return res.status(400).json({ 
          error: 'Missing user_id or link',
          code: 'VALIDATION_ERROR',
          message: 'Both user_id and link are required'
        });
      }

      // Validate link format
      try {
        new URL(link);
      } catch (e) {
        console.error('Invalid URL format:', link);
        return res.status(400).json({ 
          error: 'Invalid URL format',
          code: 'VALIDATION_ERROR',
          message: 'Please provide a valid URL'
        });
      }

      console.log('Creating history item for user:', user_id, 'Link:', link);

      const { data, error } = await supabase
        .from('link_history')
        .insert([{
          user_id,
          link: link.trim(),
          title: title?.trim() || null,
          content_type: content_type?.trim() || null,
          summary: summary?.trim() || null,
          analysis_data
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error creating history item:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log('Successfully created history item:', data.id);
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
    console.error('Unexpected error in link_history API:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
