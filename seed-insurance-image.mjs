import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '***SUPABASE_URL_REMOVED***';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '***SUPABASE_ANON_KEY_REMOVED***';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: insurances, error: fetchErr } = await supabase.from('insurances').select('id, name');
    if (fetchErr) {
        console.error("Fetch Error:", fetchErr);
        return;
    }

    if (insurances.length > 0) {
        console.log("Found insurances:", insurances.map(i => i.name));

        // Give all a cover image and icon
        const { error: updateErr } = await supabase
            .from('insurances')
            .update({
                cover_image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
                icon_url: 'https://cdn-icons-png.flaticon.com/512/3284/3284649.png'
            })
            .not('id', 'is', null);

        if (updateErr) console.error("Update Error:", updateErr);
        else console.log("Updated dummy images for all insurances successfully!");
    } else {
        console.log("No insurances found.");
    }
}

check();
