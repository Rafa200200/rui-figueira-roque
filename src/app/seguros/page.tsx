import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageNavigation } from "@/components/public/page-navigation"

export const revalidate = 0

export const metadata: Metadata = {
    title: "Seguros | Rui Figueira & Roque",
    description: "Explore a nossa oferta de seguros adequados a todas as suas necessidades: Automóvel, Vida, Habitação, Saúde e mais.",
}

export default async function InsurancesListPage() {
    const supabase = await createClient()

    const { data: insurances } = await supabase
        .from('insurances')
        .select('slug, name, short_description, icon_url')
        .eq('status', 'active')
        .order('display_order', { ascending: true })

    const { data: contacts } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_insurance_phone', 'contact_insurance_email'])

    const insurancePhone = contacts?.find(c => c.key === 'contact_insurance_phone')?.value
    const insuranceEmail = contacts?.find(c => c.key === 'contact_insurance_email')?.value

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="bg-zinc-50 border-b border-zinc-200 pb-12">
                <PageNavigation padding="pt-8 pb-4" />
                <div className="container mx-auto px-4 md:px-6 text-center mt-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                        Seguros & Proteção
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        Soluções de proteção desenhadas à sua medida, com as melhores seguradoras do mercado.
                    </p>
                </div>
            </header >

            {/* Listagem de Seguros */}
            < main className="flex-1 container mx-auto px-4 md:px-6 py-12" >
                {insurances && insurances.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {insurances.map((insurance) => (
                            <Link key={insurance.slug} href={`/seguros/${insurance.slug}`} className="group flex flex-col">
                                <div className="bg-white rounded-xl border border-zinc-200 p-8 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-brand-dark/10 text-brand-dark rounded-xl flex items-center justify-center mb-6 border border-brand-dark/20 group-hover:bg-brand-dark group-hover:text-white transition-colors shadow-sm overflow-hidden">
                                        {insurance.icon_url ? (
                                            <img src={insurance.icon_url} alt="Icon" className="w-full h-full object-cover" />
                                        ) : (
                                            <ShieldCheck className="h-6 w-6" />
                                        )}
                                    </div>
                                    <h2 className="text-lg font-bold text-zinc-900 mb-3 uppercase tracking-tight group-hover:text-brand-dark transition-colors">
                                        {insurance.name}
                                    </h2>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1 font-medium">
                                        {insurance.short_description}
                                    </p>
                                    <div className="mt-auto">
                                        <Button variant="link" className="p-0 h-auto text-brand-dark font-bold text-xs uppercase tracking-widest group/btn hover:text-brand-primary">
                                            Fazer Simulação <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="h-10 w-10 text-zinc-300" />
                        </div>
                        <h2 className="text-3xl font-bold text-zinc-900 mb-2">Seguros em breve</h2>
                        <p className="text-zinc-500 text-lg">Estamos a preparar as melhores ofertas para si.</p>
                    </div>
                )
                }
            </main >

            {/* Dedicated Contacts Banner */}
            < section className="bg-brand-dark py-16 border-t border-zinc-100" >
                <div className="container mx-auto px-4 text-center text-white relative">
                    <h3 className="text-2xl font-black mb-3 uppercase tracking-widest">Fale Connosco</h3>
                    <div className="h-1 w-16 bg-brand-accent mx-auto mb-6" />
                    <p className="text-brand-light text-sm font-medium max-w-2xl mx-auto mb-10 leading-relaxed uppercase tracking-wider">A nossa equipa está pronta para encontrar a melhor proteção para si e para a sua família.</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        {insurancePhone && (
                            <a href={`tel:${insurancePhone}`} className="group flex items-center gap-4 bg-white/5 p-5 rounded-xl hover:bg-white/10 transition-all border border-white/10 w-full md:w-auto min-w-[280px]">
                                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center shadow-lg transition-colors">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Ligar Agora</span>
                                    <span className="text-lg font-bold">{insurancePhone}</span>
                                </div>
                            </a>
                        )}
                        {insuranceEmail && (
                            <a href={`mailto:${insuranceEmail}`} className="group flex items-center gap-4 bg-white/5 p-5 rounded-xl hover:bg-white/10 transition-all border border-white/10 w-full md:w-auto min-w-[280px]">
                                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center shadow-lg transition-colors">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Enviar Email</span>
                                    <span className="text-lg font-bold truncate max-w-[180px]">{insuranceEmail}</span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </section >
        </div >
    )
}
