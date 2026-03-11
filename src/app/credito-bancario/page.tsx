import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Landmark, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageNavigation } from "@/components/public/page-navigation"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'credit_title').single()

    return {
        title: `${data?.value || "Crédito Bancário"} | Rui Figueira & Roque`,
        description: "Serviços especializados de mediação de crédito e aconselhamento financeiro.",
    }
}

export default async function CreditPage() {
    const supabase = await createClient()

    const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('group_name', ['credit', 'contacts'])

    const settings = settingsData?.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {}) || {}

    const title = settings.credit_title || "INTERMEDIÁRIO DE CRÉDITO VINCULADO"
    const textHtml = settings.credit_text || "<p>Escolher um crédito é uma decisão importante. Nós ajudamos a torná-la simples e segura.</p>"
    const bdpString = settings.credit_bdp_number || ""
    const bdpLink = settings.credit_bdp_link || ""

    const featuresTitle = settings.credit_features_title || "Transparência e Rigor"
    const featuresText = settings.credit_features_text || `<p>Escolher um crédito é uma decisão importante. Nós ajudamos a torná-la simples e segura.<br>
Na Rui Figueira & Roque Lda fazemos intermediação de crédito vinculado, procurando sempre as melhores soluções para si:</p>
<p><strong>Crédito Habitação</strong> - apoio na compra da sua casa.</p>
<p><strong>Crédito Consolidado</strong> - simplificação e melhor gestão financeira.</p>
<p>Trabalhamos com várias instituições financeiras para garantir-lhe as condições mais vantajosas, sempre com aconselhamento transparente e responsável.</p>`

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* HEADER SECTION */}
            <header className="bg-zinc-50 border-b border-zinc-200 pb-12">
                <PageNavigation padding="pt-8 pb-4" />
                <div className="container mx-auto px-4 md:px-6 mt-4">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-brand-primary rounded-xl flex items-center justify-center text-white mb-2 shadow-sm">
                            <Landmark className="h-8 w-8" />
                        </div>
                        {bdpString && (
                            bdpLink ? (
                                <a
                                    href={bdpLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-white text-zinc-500 hover:text-brand-primary px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wider border border-zinc-200 hover:border-brand-primary/50 uppercase shadow-xs transition-colors"
                                >
                                    Registo Banco de Portugal: {bdpString}
                                </a>
                            ) : (
                                <span className="inline-block bg-white text-zinc-500 px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wider border border-zinc-200 uppercase shadow-xs">
                                    Registo Banco de Portugal: {bdpString}
                                </span>
                            )
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl">
                            Simplificamos a sua vida financeira, negociando as melhores taxas e condições junto da banca para que concretize os seus projetos com total confiança.
                        </p>
                    </div>
                </div>
            </header >

            <main className="flex-1 container mx-auto px-4 md:px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* LEFT: CONTENT DESC */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: textHtml }} />

                        <div className="bg-zinc-50 p-8 rounded-xl border border-zinc-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                                <div className="p-2.5 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                {featuresTitle}
                            </h3>
                            <div className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-600 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: featuresText }} />
                        </div>
                    </div>

                    {/* RIGHT: CONTACT CARD */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <div className="bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden">
                            <div className="bg-brand-dark p-8 text-white text-center relative">
                                <h3 className="text-2xl font-bold mb-3 relative z-10">Apoio Financeiro</h3>
                                <p className="text-white/60 text-sm font-medium relative z-10">
                                    Fale hoje com um dos nossos consultores e descubra quanto pode poupar.
                                </p>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-5">
                                    <div className="group">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Linha Direta</h4>
                                        {settings.contact_credit_phone ? (
                                            <a href={`tel:${settings.contact_credit_phone}`} className="flex items-center gap-3 bg-zinc-50 p-4 rounded-lg hover:bg-brand-primary hover:text-white transition-all border border-zinc-100 group/item">
                                                <div className="p-2.5 bg-white rounded-lg text-brand-primary shadow-sm group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                                                    <Landmark className="h-4 w-4" />
                                                </div>
                                                <span className="text-xl font-bold">{settings.contact_credit_phone}</span>
                                            </a>
                                        ) : (
                                            <p className="text-zinc-500 italic text-sm">Contacto não disponível.</p>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Enviar Proposta</h4>
                                        {settings.contact_credit_email ? (
                                            <a href={`mailto:${settings.contact_credit_email}`} className="flex items-center gap-3 bg-zinc-50 p-4 rounded-lg hover:bg-zinc-900 hover:text-white transition-all border border-zinc-100 group/email">
                                                <div className="p-2.5 bg-white rounded-lg text-zinc-400 shadow-sm group-hover/email:bg-white/10 group-hover/email:text-white transition-colors">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-bold truncate">{settings.contact_credit_email}</span>
                                            </a>
                                        ) : (
                                            <p className="text-zinc-500 italic text-sm">Email não disponível.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    {settings.contact_credit_phone ? (
                                        <a href={`tel:${settings.contact_credit_phone}`} className="w-full block">
                                            <Button className="w-full h-12 text-base font-bold bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg shadow-sm transition-all group">
                                                Contactar Agora <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </a>
                                    ) : settings.contact_credit_email ? (
                                        <a href={`mailto:${settings.contact_credit_email}`} className="w-full block">
                                            <Button className="w-full h-12 text-base font-bold bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg shadow-sm transition-all group">
                                                Enviar Email <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div >
    )
}
