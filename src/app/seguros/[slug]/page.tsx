import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ShieldCheck, Mail, Phone, ArrowRight, CheckCircle2, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/public/lead-form"
import { PageNavigation } from "@/components/public/page-navigation"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: insurance } = await supabase
        .from('insurances')
        .select('name, short_description')
        .eq('slug', slug)
        .single()

    if (!insurance) return { title: "Seguro não encontrado" }

    return {
        title: `${insurance.name} | Rui Figueira & Roque`,
        description: insurance.short_description,
    }
}

export default async function InsuranceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: insurance, error } = await supabase
        .from('insurances')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

    if (error || !insurance) {
        notFound()
    }

    const { data: contactsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_insurance_phone', 'contact_insurance_email'])

    const contacts = contactsData?.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {}) || {}

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
            {/* Header */}
            <header className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pb-12 relative overflow-hidden">
                {insurance.cover_image_url && (
                    <div className="absolute inset-0 z-0 opacity-10">
                        <img src={insurance.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="relative z-20">
                    <PageNavigation padding="pt-8 pb-4" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center mt-4">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-brand-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-sm overflow-hidden">
                            {insurance.icon_url ? (
                                <img src={insurance.icon_url} alt="Icon" className="w-full h-full object-cover" />
                            ) : (
                                <ShieldCheck className="h-8 w-8" />
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight relative">
                            {insurance.name}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto">
                            {insurance.short_description}
                        </p>
                    </div>
                </div>
            </header >

            <main className="container mx-auto px-4 md:px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    <div className="lg:col-span-7 space-y-12">
                        <section className="prose prose-zinc dark:prose-invert prose-sm md:prose-base max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center gap-3">
                                <div className="p-2.5 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary shadow-xs border border-brand-primary/10">
                                    <FileText className="h-5 w-5" />
                                </div>
                                Descrição do Plano
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: insurance.full_description || "<p>Proteção completa para si...</p>" }} />
                        </section>

                        {insurance.benefits && Array.isArray(insurance.benefits) && insurance.benefits.length > 0 && (
                            <section className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-sm">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    Vantagens e Coberturas
                                </h3>
                                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                                    {insurance.benefits.map((feat: any) => (
                                        <li key={feat} className="flex items-start gap-3 text-zinc-600 text-sm font-medium">
                                            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 shrink-0" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {insurance.faqs && Array.isArray(insurance.faqs) && insurance.faqs.length > 0 && (
                            <section className="space-y-8">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-xs">
                                        <HelpCircle className="h-5 w-5" />
                                    </div>
                                    Perguntas Frequentes
                                </h3>
                                <div className="space-y-4">
                                    {insurance.faqs.map((faq: any, i: number) => (
                                        <div key={i} className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-brand-primary/20 transition-colors">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 text-base">{faq.q}</p>
                                            <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT: SIMULATION FORM */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                            <div className="bg-brand-dark p-8 text-white text-center relative">
                                <h3 className="text-2xl font-bold mb-3 relative z-10">Simulação Grátis</h3>
                                <p className="text-white/60 text-sm font-medium relative z-10">
                                    Receba a melhor proposta do mercado em menos de 24 horas.
                                </p>
                            </div>

                            <div className="p-8 space-y-8">
                                <LeadForm
                                    type="insurance_simulation"
                                    insuranceId={insurance.id}
                                    buttonText="Pedir Simulação"
                                    dynamicFields={insurance.form_fields}
                                />

                                {/* Department specific contacts */}
                                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                                    <p className="text-[10px] font-bold text-center text-zinc-400 uppercase tracking-widest leading-none">Apoio Direto</p>
                                    <div className="flex flex-col gap-4">
                                        {contacts.contact_insurance_phone && (
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 bg-brand-primary shadow-xs rounded-lg flex items-center justify-center text-white group-hover:bg-brand-dark transition-colors">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight">Telefone</span>
                                                    <a href={`tel:${contacts.contact_insurance_phone}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-brand-primary transition-colors">{contacts.contact_insurance_phone}</a>
                                                </div>
                                            </div>
                                        )}
                                        {contacts.contact_insurance_email && (
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs rounded-lg flex items-center justify-center text-zinc-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-colors">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight">Email</span>
                                                    <a href={`mailto:${contacts.contact_insurance_email}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-brand-primary transition-colors truncate">{contacts.contact_insurance_email}</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div >
    )
}
