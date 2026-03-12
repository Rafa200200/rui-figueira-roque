import Link from "next/link"
import { Building2, ShieldCheck, Landmark, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { PriceFormatter } from "@/components/ui/price-formatter"

export const revalidate = 0 // Opt out of full static rendering

interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  business_type: 'sale' | 'rent';
  typology: string;
  municipality: string;
  district: string;
  property_images: { url: string; alt_text?: string }[];
}

export default async function HomePage() {
  const supabase = await createClient()

  // 1. Fetch Site Settings for the Homepage
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('group_name', ['homepage', 'about'])

  const settings = settingsData?.reduce((acc: Record<string, string>, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {}) || {}

  // 2. Fetch Featured Properties (limit 3)
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select(`
id, title, slug, price, business_type, typology, municipality, district,
  property_images(url, alt_text)
    `)
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* PROFESSIONAL HERO BANNER WITH BACKGROUND IMAGE */}
      <header className="w-full relative overflow-hidden">
        {/* Background Image */}
        {settings.hero_image && (
          <Image
            src={settings.hero_image}
            alt="Banner"
            fill
            className="object-cover object-center"
            priority
          />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Content */}
        <div className="relative z-10 container px-4 md:px-6 mx-auto flex flex-col items-center text-center py-6 lg:py-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 text-white uppercase drop-shadow-lg">
            {settings.hero_title || "Rui Figueira & Roque, Lda"}
          </h1>
          <p className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
            {settings.hero_subtitle || "Soluções integradas em Imobiliária, Seguros e Crédito."}
          </p>
        </div>
      </header>

      {/* SERVICES SECTION - BROUGHT TO TOP */}
      <section className="pt-8 lg:pt-12 pb-4 lg:pb-6 bg-white dark:bg-zinc-950 relative z-20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Real Estate Card */}
            <div className="group bg-white dark:bg-zinc-900 rounded-2xl p-10 border border-zinc-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
              <div className="w-14 h-14 bg-brand-primary rounded-xl flex items-center justify-center mb-8 text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Imobiliária</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed font-medium">
                Gestão profissional na compra, venda e arrendamento de imóveis. O seu parceiro estratégico no mercado imobiliário nacional.
              </p>
              <Link href="/imoveis" className="mt-auto">
                <Button variant="outline" className="w-full border-zinc-200 dark:border-zinc-700 text-brand-primary font-bold text-xs uppercase tracking-widest h-11 rounded-xl hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm">
                  Consultar Portefólio
                </Button>
              </Link>
            </div>

            {/* Insurance Card */}
            <div className="group bg-white dark:bg-zinc-900 rounded-2xl p-10 border border-zinc-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
              <div className="w-14 h-14 bg-brand-dark rounded-xl flex items-center justify-center mb-8 text-white shadow-lg shadow-brand-dark/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Seguros</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed font-medium">
                Proteção abrangente para particulares e empresas. Consultoria especializada para garantir as melhores coberturas do mercado.
              </p>
              <Link href="/seguros" className="mt-auto">
                <Button variant="outline" className="w-full border-zinc-100 dark:border-zinc-700 text-brand-dark dark:text-brand-light font-bold text-xs uppercase tracking-widest h-11 rounded-xl hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all shadow-sm">
                  Pedir Simulação
                </Button>
              </Link>
            </div>

            {/* Credit Card */}
            <div className="group bg-white dark:bg-zinc-900 rounded-2xl p-10 border border-zinc-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
              <div className="w-14 h-14 bg-brand-accent rounded-xl flex items-center justify-center mb-8 text-white shadow-lg shadow-brand-accent/20 group-hover:scale-110 transition-transform">
                <Landmark className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">Crédito Bancário</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed font-medium">
                Intermediação de crédito certificada. Soluções financeiras otimizadas para crédito habitação e crédito pessoal.
              </p>
              <Link href="/credito-bancario" className="mt-auto">
                <Button variant="outline" className="w-full border-zinc-100 dark:border-zinc-700 text-brand-accent font-bold text-xs uppercase tracking-widest h-11 rounded-xl hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all shadow-sm">
                  Analisar Opções
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ABOUT US TRUST SECTION */}
      <section className="pt-4 lg:pt-6 pb-8 lg:pb-12 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch shadow-xl rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 max-w-5xl mx-auto">
            {/* Left Side: Photo */}
            <div className="lg:w-2/5 relative min-h-[300px]">
              {settings.about_photo ? (
                <Image
                  src={settings.about_photo}
                  alt="Rui Figueira"
                  fill
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600 font-bold uppercase tracking-[0.3em]">Foto em breve</div>
              )}
            </div>

            {/* Right Side: Professional Info */}
            <div className="lg:w-3/5 bg-brand-dark p-8 md:p-12 flex flex-col justify-center text-white relative">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-black tracking-widest mb-3 uppercase">
                    Sobre Nós
                  </h2>
                  <div className="h-1 w-16 bg-brand-accent" />
                </div>

                <div className="space-y-6 text-zinc-300 font-medium leading-relaxed text-lg">
                  {settings.about_bio ? (
                    <div dangerouslySetInnerHTML={{ __html: settings.about_bio }} />
                  ) : (
                    <p>
                      Na Rui Figueira & Roque Lda acreditamos que cada cliente merece soluções claras, seguras e ajustadas às suas necessidades.
                      Com experiência nas áreas de seguros, mediação imobiliária e intermediação de crédito vinculado, trabalhamos com profissionalismo, proximidade e independência.
                    </p>
                  )}
                </div>

                <div className="mt-16 pt-12 border-t border-white/10 flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white text-[10px] font-black">RFR</div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-[0.2em] text-white">RUI FIGUEIRA & ROQUE LDA</span>
                      <span className="text-[8px] font-bold tracking-[0.4em] text-brand-primary uppercase">Confiança</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-12 bg-white dark:bg-zinc-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Exclusividade</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-4 font-heading uppercase">
                  Imóveis em Destaque
                </h2>
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">As nossas recomendações premium no mercado atual.</p>
              </div>
              <Link href="/imoveis">
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] shadow-sm">
                  Ver Portefólio Completo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProperties.map((property: Property) => {
                const primaryImage = property.property_images?.[0]

                return (
                  <Link key={property.id} href={`/imoveis/${property.slug}`} className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt_text || property.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 font-bold text-[10px] uppercase tracking-widest">Sem Imagem Disponível</div>
                      )}
                      <div className="absolute top-6 left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                        {property.business_type === 'sale' ? 'Venda' : 'Arrendamento'}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <PriceFormatter
                        price={property.price}
                        businessType={property.business_type}
                        className="text-2xl mb-2"
                        amountClassName="text-zinc-900 dark:text-zinc-100"
                      />
                      <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400 mb-6 line-clamp-1 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {property.title}
                      </h3>
                      <div className="mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between text-zinc-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-zinc-900 dark:text-zinc-300" />
                          <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[120px]">{property.municipality}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-zinc-900 dark:text-zinc-300" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{property.typology}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* FINAL TRUST BANNER */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-brand-dark rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-lg border border-white/10">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading">
                Rui Figueira & Roque Lda
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                Parceiros de confiança em cada decisão importante da sua vida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contacto">
                  <Button size="lg" className="bg-brand-primary hover:bg-brand-accent text-white font-bold px-8 h-14 rounded-lg shadow-sm">
                    Fale Connosco
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
