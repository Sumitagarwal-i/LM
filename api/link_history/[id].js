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

  try {
    const { id } = req.query;
    const { user_id } = req.query;
    
    // Validate required parameters
    if (!id) {
      console.error('Missing history id in request:', { method: req.method, query: req.query });
      return res.status(400).json({ 
        error: 'Missing history id',
        code: 'VALIDATION_ERROR',
        message: 'History id is required'
      });
    }

    if (!user_id) {
      console.error('Missing user_id in request:', { method: req.method, query: req.query });
      return res.status(400).json({ 
        error: 'Missing user_id',
        code: 'VALIDATION_ERROR',
        message: 'user_id is required'
      });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting history item:', id, 'for user:', user_id);
      
      // First check if the history item exists and belongs to the user
      const { data: existingItem, error: checkError } = await supabase
        .from('link_history')
        .select('id')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          console.error('History item not found or access denied:', { id, user_id });
          return res.status(404).json({ 
            error: 'History item not found',
            code: 'NOT_FOUND',
            message: 'History item not found or you do not have permission to access it'
          });
        }
        console.error('Database error checking history item:', checkError);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: checkError.message
        });
      }

      const { error } = await supabase
        .from('link_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) {
        console.error('Database error deleting history item:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log('Successfully deleted history item:', id);
      res.status(204).end();
      
    } else {
      console.error('Method not allowed:', req.method);
      res.status(405).json({ 
        error: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
        message: `${req.method} is not supported for this endpoint`
      });
    }
  } catch (err) {
    console.error('Unexpected error in link_history/[id] API:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
} 