import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { MapPin, Phone, Mail, Clock, Send, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/public/lead-form"
import { PageNavigation } from "@/components/public/page-navigation"

export const revalidate = 0

export const metadata: Metadata = {
    title: "Contacto | Rui Figueira & Roque",
    description: "Entre em contacto connosco. Estamos localizados em Braga e disponíveis para o ajudar em Imóveis, Seguros e Crédito.",
}

export default async function ContactPage() {
    const supabase = await createClient()

    const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value')

    const settings = settingsData?.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {}) || {}

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <div className="bg-brand-dark pt-8">
                <PageNavigation padding="py-0" />
            </div>

            {/* Header */}
            <div className="bg-brand-dark text-white py-16 pt-8">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Fale Connosco</h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">Disponíveis para acolher os seus projetos e proteger o seu futuro.</p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16 -mt-10">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* INFO CARDS */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-brand-dark mb-8">Informações de Contacto</h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary mb-4 border border-brand-primary/10">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-zinc-900 mb-2">Morada</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">{settings.footer_address || "Braga, Portugal"}</p>
                            </div>

                            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
                                <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary mb-4 border border-brand-primary/10">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-zinc-900 mb-2">Horário</h3>
                                <p className="text-sm text-zinc-500 whitespace-pre-line leading-relaxed">{settings.footer_hours || "Seg-Sex: 09h-18h"}</p>
                            </div>
                        </div>

                        {/* Contacts Grid */}
                        <div className="p-8 bg-zinc-50 rounded-xl border border-zinc-200">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-6">Departamentos</h4>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center pb-5 border-b border-zinc-200">
                                        <span className="font-bold text-zinc-900 text-sm">Imobiliária</span>
                                        <div className="text-right">
                                            <p className="text-brand-primary font-bold">{settings.contact_realestate_phone || "N/A"}</p>
                                            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">{settings.contact_realestate_email || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pb-5 border-b border-zinc-200">
                                        <span className="font-bold text-zinc-900 text-sm">Seguros</span>
                                        <div className="text-right">
                                            <p className="text-brand-primary font-bold">{settings.contact_insurance_phone || "N/A"}</p>
                                            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">{settings.contact_insurance_email || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-zinc-900 text-sm">Créditos</span>
                                        <div className="text-right">
                                            <p className="text-brand-primary font-bold">{settings.contact_credit_phone || "N/A"}</p>
                                            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">{settings.contact_credit_email || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT FORM */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-zinc-200 h-fit">
                        <h2 className="text-2xl font-bold mb-8 text-zinc-900">Envie uma Mensagem</h2>
                        <LeadForm type="contact" buttonText="Enviar Mensagem" buttonColor="bg-brand-primary hover:bg-brand-dark" />
                    </div>

                </div>
            </main>
        </div>
    )
}
