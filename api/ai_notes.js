// /api/ai_notes.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=59'
  );

  try {
    const { user_id } = req.query;

    // Optional: Filter notes by user if needed
    const query = supabase.from('ai_notes').select('*').order('created_at', { ascending: false });

    if (user_id) query.eq('user_id', user_id);

    const { data, error } = await query;

    if (error) return res.status(500).json({ error });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', details: err.message });
  }
}
