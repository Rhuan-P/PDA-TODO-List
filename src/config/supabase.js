import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sua-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anon';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
