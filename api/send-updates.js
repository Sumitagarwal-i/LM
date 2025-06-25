import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/nodejs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    // 1. Query all users with notifications enabled
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('notifications_enabled', true);
    if (settingsError) throw settingsError;
    if (!settings.length) return res.status(200).json({ sent: 0 });

    // 2. Get emails from profiles in a single query
    const userIds = settings.map(row => row.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .in('id', userIds);
    if (profilesError) throw profilesError;

    // 3. Send emails in parallel (batch)
    const SERVICE_ID = 'service_fhmiq88';
    const TEMPLATE_ID = 'template_wspruvk';
    const PUBLIC_KEY = 'WCDLs933siaszXpig';
    const PRIVATE_KEY = '1uSbSc7WmUcyPff_5jtFs';

    const sendPromises = profiles
      .filter(profile => profile.email)
      .map(profile =>
        emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            to_email: profile.email,
            to_name: profile.full_name || profile.email,
            message,
          },
          {
            publicKey: PUBLIC_KEY,
            privateKey: PRIVATE_KEY,
          }
        )
      );

    await Promise.all(sendPromises);
    res.status(200).json({ sent: sendPromises.length });
  } catch (err) {
    console.error('Send updates error:', err);
    res.status(500).json({ error: err.message });
  }
} 