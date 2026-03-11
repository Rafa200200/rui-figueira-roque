import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['credit_title', 'credit_subtitle', 'credit_bdp_number'])

    return NextResponse.json({ data, error })
}
