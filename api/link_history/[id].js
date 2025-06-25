import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    const { user_id } = req.query;
    
    if (!id || !user_id) {
      return res.status(400).json({ error: 'Missing id or user_id' });
    }

    if (req.method === 'DELETE') {
      // Delete history item
      const { error } = await supabase
        .from('link_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) return res.status(500).json({ error: error.message });
      res.status(204).end();
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
} 