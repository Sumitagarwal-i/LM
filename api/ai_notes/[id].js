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
      console.error('Missing note id in request:', { method: req.method, query: req.query });
      return res.status(400).json({ 
        error: 'Missing note id',
        code: 'VALIDATION_ERROR',
        message: 'Note id is required'
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

    if (req.method === 'PUT') {
      console.log('Updating note:', id, 'for user:', user_id, 'Body:', req.body);
      
      const { title, content } = req.body;
      
      // Validate required fields
      if (!title || !content) {
        console.error('Missing required fields for update:', { title: !!title, content: !!content });
        return res.status(400).json({ 
          error: 'Missing title or content',
          code: 'VALIDATION_ERROR',
          message: 'Both title and content are required for updates'
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

      // First check if the note exists and belongs to the user
      const { data: existingNote, error: checkError } = await supabase
        .from('ai_notes')
        .select('id')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          console.error('Note not found or access denied:', { id, user_id });
          return res.status(404).json({ 
            error: 'Note not found',
            code: 'NOT_FOUND',
            message: 'Note not found or you do not have permission to access it'
          });
        }
        console.error('Database error checking note:', checkError);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: checkError.message
        });
      }

      const { data, error } = await supabase
        .from('ai_notes')
        .update({ 
          title: title.trim(), 
          content: content.trim(), 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('user_id', user_id)
        .select()
        .single();

      if (error) {
        console.error('Database error updating note:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log('Successfully updated note:', id);
      res.status(200).json(data);
      
    } else if (req.method === 'DELETE') {
      console.log('Deleting note:', id, 'for user:', user_id);
      
      // First check if the note exists and belongs to the user
      const { data: existingNote, error: checkError } = await supabase
        .from('ai_notes')
        .select('id')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          console.error('Note not found or access denied:', { id, user_id });
          return res.status(404).json({ 
            error: 'Note not found',
            code: 'NOT_FOUND',
            message: 'Note not found or you do not have permission to access it'
          });
        }
        console.error('Database error checking note:', checkError);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: checkError.message
        });
      }

      const { error } = await supabase
        .from('ai_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) {
        console.error('Database error deleting note:', error);
        return res.status(500).json({ 
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: error.message
        });
      }

      console.log('Successfully deleted note:', id);
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
    console.error('Unexpected error in ai_notes/[id] API:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
} 