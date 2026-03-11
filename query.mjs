import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '***SUPABASE_URL_REMOVED***';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '***SUPABASE_ANON_KEY_REMOVED***';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: insurances, error: fetchErr } = await supabase.from('insurances').select('id, name, form_fields');
    console.log(JSON.stringify(insurances, null, 2));
}

check();
