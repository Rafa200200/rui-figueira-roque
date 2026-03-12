import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Search, MapPin, Euro, Home as HomeIcon, ArrowRight, SlidersHorizontal, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PropertySearch } from "@/components/public/property-search"
import { PageNavigation } from "@/components/public/page-navigation"
import { Suspense } from "react"
import { PriceFormatter } from "@/components/ui/price-formatter"

export const revalidate = 0

export const metadata: Metadata = {
    title: "Imóveis | Rui Figueira & Roque",
    description: "Encontre a sua casa de sonho na nossa listagem de imóveis para venda e arrendamento.",
}

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const supabase = await createClient()

    // Base query
    let query = supabase
        .from('properties')
        .select(`
            id, title, slug, price, business_type, property_type, typology, area_m2, 
            municipality, district, energy_certificate,
            property_images(url, alt_text)
        `)
        .eq('status', 'active')

    // Apply filters from URL
    if (params.type) {
        query = query.eq('business_type', params.type)
    }
    if (params.property_type) {
        query = query.eq('property_type', params.property_type)
    }
    if (params.typology) {
        query = query.eq('typology', params.typology)
    }
    if (params.district) {
        query = query.ilike('district', `%${params.district}%`)
    }

    const { data: properties, error } = await query.order('created_at', { ascending: false })

    const { data: contactsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_realestate_phone', 'contact_realestate_email'])

    const contacts = contactsData?.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {}) || {}

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
            {/* Header / Search Hero */}
            <header className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pb-12">
                <PageNavigation padding="pt-8 pb-4" />
                <div className="container mx-auto px-4 mt-4">
                    <div className="max-w-3xl mx-auto text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Nossos Imóveis</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg">Encontre o espaço perfeito para o seu próximo capítulo.</p>
                    </div>

                    {/* Filters */}
                    <div className="max-w-4xl mx-auto">
                        <Suspense fallback={<div className="h-24 bg-white rounded-xl animate-pulse shadow-sm" />}>
                            <PropertySearch />
                        </Suspense>
                    </div>
                </div>
            </header >

            {/* Results */}
            < main className="flex-1 container mx-auto px-4 py-12" >
                <div className="flex items-center justify-between mb-8">
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                        A mostrar <span className="font-bold text-zinc-900 dark:text-zinc-100">{properties?.length || 0}</span> imóveis disponíveis
                    </p>
                    <Button variant="outline" size="sm" className="md:hidden rounded-lg font-semibold">
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros
                    </Button>
                </div>

                {
                    properties && properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => {
                                const mainImage = property.property_images?.[0]?.url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"

                                return (
                                    <Link key={property.id} href={`/imoveis/${property.slug}`} className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <Image
                                                src={mainImage}
                                                alt={property.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4 bg-brand-primary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                                                {property.business_type === 'sale' ? 'Venda' : 'Arrendamento'}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <PriceFormatter
                                                price={property.price}
                                                businessType={property.business_type}
                                                className="text-xl mb-1"
                                                amountClassName="text-brand-dark dark:text-brand-light"
                                            />
                                            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-1 group-hover:text-brand-primary transition-colors">{property.title}</h2>

                                            <div className="mt-auto space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                <div className="flex items-center text-xs text-zinc-500 font-medium gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                                                    <span>{property.municipality}, {property.district}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <HomeIcon className="h-3.5 w-3.5 text-brand-primary" />
                                                        <span>{property.typology}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-base leading-none">📏</span>
                                                        <span>{property.area_m2} m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Nenhum imóvel encontrado</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Tente ajustar os seus filtros para encontrar o que procura.</p>
                        </div>
                    )
                }
            </main >

            {/* Department Contacts */}
            < section className="bg-brand-dark py-16 border-t border-zinc-100" >
                <div className="container mx-auto px-4 text-center text-white relative">
                    <h3 className="text-2xl font-black mb-3 uppercase tracking-widest">Fale Connosco</h3>
                    <div className="h-1 w-16 bg-brand-accent mx-auto mb-6" />
                    <p className="text-brand-light text-sm font-medium max-w-2xl mx-auto mb-10 leading-relaxed uppercase tracking-wider">A nossa equipa imobiliária está pronta para ajudar na sua próxima decisão.</p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        {contacts.contact_realestate_phone && (
                            <a href={`tel:${contacts.contact_realestate_phone}`} className="group flex items-center gap-4 bg-white/5 p-5 rounded-xl hover:bg-white/10 transition-all border border-white/10 w-full md:w-auto min-w-[280px]">
                                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center shadow-lg transition-colors">
                                    <Phone className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Ligar Agora</span>
                                    <span className="text-lg font-bold">{contacts.contact_realestate_phone}</span>
                                </div>
                            </a>
                        )}
                        {contacts.contact_realestate_email && (
                            <a href={`mailto:${contacts.contact_realestate_email}`} className="group flex items-center gap-4 bg-white/5 p-5 rounded-xl hover:bg-white/10 transition-all border border-white/10 w-full md:w-auto min-w-[280px]">
                                <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center shadow-lg transition-colors">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Enviar Email</span>
                                    <span className="text-lg font-bold truncate max-w-[180px]">{contacts.contact_realestate_email}</span>
                                </div>
                            </a>
                        )}
                    </div>
                </div>
            </section >
        </div >
    )
}
