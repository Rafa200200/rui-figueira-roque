import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
    ChevronRight,
    MapPin,
    Home,
    Maximize2,
    BedDouble,
    Bath,
    Zap,
    Phone,
    Mail,
    Calendar,
    ArrowLeft,
    ArrowRight,
    Share2,
    CheckCircle2,
    Heart,
    Compass,
    Tag,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LeadForm } from "@/components/public/lead-form"
import { PropertyGallery } from "@/components/public/property-gallery"
import { ShareButton } from "@/components/public/share-button"
import { PageNavigation } from "@/components/public/page-navigation"
import { PropertyMapClient } from "@/components/public/property-map-client"

export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: property } = await supabase
        .from('properties')
        .select('title, description')
        .eq('slug', slug)
        .single()

    if (!property) return { title: "Imóvel não encontrado" }

    return {
        title: `${property.title} | Rui Figueira & Roque`,
        description: property.description.replace(/<[^>]*>/g, '').substring(0, 160),
    }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: property, error } = await supabase
        .from('properties')
        .select(`
            *,
            property_images(url, alt_text, display_order)
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

    if (error || !property) {
        notFound()
    }

    const { data: contactsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_realestate_phone', 'contact_realestate_email', 'social_whatsapp'])

    const contacts = contactsData?.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {}) || {}

    const images = property.property_images?.sort((a: any, b: any) => a.display_order - b.display_order) || []
    const mainImage = images[0]?.url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"
    const priceFormatted = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(property.price)

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
            {/* Top Navigation / Breadcrumbs */}
            <PageNavigation padding="py-8" />

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* LEFT COLUMN: Gallery & Details */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {/* Title & Location Header */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <Badge className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border-none font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">
                                    {property.business_type === 'sale' ? 'Venda' : 'Arrendamento'}
                                </Badge>
                                {property.featured && <Badge className="bg-amber-50 text-amber-600 border border-amber-100 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">Destaque</Badge>}
                                {property.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 font-semibold px-3 py-1 rounded text-[10px] uppercase tracking-wider">{tag}</Badge>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
                                {property.title}
                            </h1>
                            <div className="flex items-center text-zinc-500 gap-2">
                                <MapPin className="h-5 w-5 text-brand-primary shrink-0" />
                                <span className="text-lg font-medium">{property.municipality}, {property.district}</span>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <PropertyGallery images={images} title={property.title} />

                        {/* Quick Specs Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700">
                                    <Maximize2 className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Área Bruta</span>
                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{property.area_m2} m²</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700">
                                    <BedDouble className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Quartos</span>
                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{property.typology}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700">
                                    <Bath className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Banhos</span>
                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{property.bathrooms || 1}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700">
                                    <Zap className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Certificado Ener.</span>
                                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{property.energy_certificate || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Sobre o Imóvel</h2>
                            <div
                                className="prose prose-zinc dark:prose-invert prose-sm md:prose-base max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
                                dangerouslySetInnerHTML={{ __html: property.description }}
                            />
                        </div>

                        {/* Features List */}
                        {property.features && property.features.length > 0 && (
                            <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Características Detalhadas</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {property.features.map((feat: string) => (
                                        <div key={feat} className="flex items-center gap-2.5 group">
                                            <div className="w-6 h-6 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Property Map Location */}
                        {property.latitude && property.longitude && (
                            <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800">
                                <PropertyMapClient
                                    lat={property.latitude}
                                    lng={property.longitude}
                                    parish={property.parish}
                                    municipality={property.municipality}
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Price & Lead Form Sticky */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
                        {/* Price Card */}
                        <div className="bg-brand-dark text-white p-8 rounded-xl shadow-lg relative overflow-hidden border border-white/10">
                            <div className="relative z-10">
                                <div className="text-[10px] font-bold opacity-50 mb-1 uppercase tracking-wider text-white">Preço de Venda</div>
                                <div className="text-4xl font-black mb-8 text-white">{priceFormatted}</div>

                                <div className="space-y-3">
                                    {contacts.social_whatsapp && (
                                        <a
                                            href={`https://wa.me/${contacts.social_whatsapp}?text=Olá! Estou interessado no imóvel: ${property.title}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 font-bold py-4 rounded-lg flex items-center justify-center transition-all shadow-sm text-base group"
                                        >
                                            Falar no WhatsApp <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    )}
                                    <ShareButton
                                        title={property.title}
                                        text={`Vê este imóvel: ${property.title}`}
                                        url={typeof window !== 'undefined' ? window.location.href : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visit Request Form */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-brand-primary">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                Agendar Visita
                            </h3>
                            <LeadForm
                                type="visit_request"
                                propertyId={property.id}
                                buttonText="Enviar Pedido de Visita"
                            />

                            {/* Secondary contacts */}
                            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                                <p className="text-[10px] font-bold text-center text-zinc-400 uppercase tracking-wider">Contacto Directo</p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-semibold group">
                                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                            <Phone className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-sm">{contacts.contact_realestate_phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-semibold group">
                                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                            <Mail className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-sm truncate">{contacts.contact_realestate_email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
