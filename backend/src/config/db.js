const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
// Prioritize SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY if RLS is enabled on Supabase
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL atau SUPABASE_KEY / SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment variables');
}

const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseKey || 'dummy-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

console.log('✅ Supabase Server Client Initialized');

module.exports = { supabase };
