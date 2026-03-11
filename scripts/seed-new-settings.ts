import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // We need this to bypass RLS for seeding

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedSettings() {
    const settingsToInsert = [
        { key: 'contact_realestate_phone', value: '+351 912 345 678', type: 'text', group_name: 'contacts' },
        { key: 'contact_realestate_email', value: 'imoveis@ruifigueiraroque.pt', type: 'text', group_name: 'contacts' },
        { key: 'contact_insurance_phone', value: '+351 910 111 222', type: 'text', group_name: 'contacts' },
        { key: 'contact_insurance_email', value: 'seguros@ruifigueiraroque.pt', type: 'text', group_name: 'contacts' },
        { key: 'contact_credit_phone', value: '+351 917 386 783', type: 'text', group_name: 'contacts' },
        { key: 'contact_credit_email', value: 'rfr.creditos@gmail.com', type: 'text', group_name: 'contacts' },
        { key: 'credit_bdp_number', value: 'BdP 0006370', type: 'text', group_name: 'credit' },
        { key: 'credit_title', value: 'INTERMEDIÁRIO DE CRÉDITO VINCULADO', type: 'text', group_name: 'credit' },
        { key: 'credit_text', value: '<p>Escolher um crédito é uma decisão importante. Nós ajudamos a torná-la simples e segura.</p><p>Na Rui Figueira & Roque Lda fazemos intermediação de crédito vinculado, procurando sempre as melhores soluções para si:</p><ul><li>Crédito Habitação – apoio na compra da sua casa.</li><li>Crédito Consolidado – simplificação e melhor gestão financeira.</li></ul><p>Trabalhamos com várias instituições financeiras para garantir-lhe as condições mais vantajosas, sempre com aconselhamento transparente e responsável.</p>', type: 'richtext', group_name: 'credit' },
        { key: 'hero_cta_credit', value: 'Saber Mais', type: 'text', group_name: 'homepage' }
    ]

    for (const setting of settingsToInsert) {
        // Upsert to avoid conflicts if they already exist
        const { error } = await supabase
            .from('site_settings')
            .upsert(setting, { onConflict: 'key' })

        if (error) {
            console.error(`Error inserting ${setting.key}:`, error)
        } else {
            console.log(`Successfully upserted ${setting.key}`)
        }
    }
}

seedSettings().then(() => console.log('Done!')).catch(console.error)
