import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export const revalidate = 0

export const metadata: Metadata = {
    title: "Sobre Nós | Rui Figueira & Roque",
    description: "Saiba mais sobre a nossa empresa, a nossa equipa e a nossa missão.",
}

export default async function AboutUsPage() {
    const supabase = await createClient()

    const { data: settingsData } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('group_name', ['about'])

    const settings = settingsData?.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {}) || {}

    return (
        <div className="flex flex-col min-h-screen">
            {/* HERÓI SIMPLES DA PÁGINA */}
            <div className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {settings.about_title || "Sobre Nós"}
                    </h1>
                    <div className="w-12 h-1 bg-brand-primary mx-auto mb-4"></div>
                </div>
            </div>

            {/* CONTEÚDO */}
            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

                    {/* Imagem */}
                    <div className="relative aspect-[4/5] md:aspect-square rounded-xl overflow-hidden shadow-lg border border-zinc-200">
                        {settings.about_photo ? (
                            <Image
                                src={settings.about_photo}
                                alt="A nossa equipa"
                                fill
                                className="object-cover object-center"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-zinc-300">
                                Sem Imagem
                            </div>
                        )}
                    </div>

                    {/* Textos */}
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                                <div className="w-1 h-8 bg-brand-primary rounded-full" />
                                Quem Somos
                            </h2>
                            <div
                                className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: settings.about_bio || "<p>A Rui Figueira & Roque atua no mercado...</p>" }}
                            />
                        </section>

                        <section className="bg-zinc-50 p-8 rounded-xl border border-zinc-200 shadow-sm">
                            <h2 className="text-xl font-bold text-brand-primary mb-4 uppercase tracking-wider text-[10px]">A Nossa Missão</h2>
                            <div
                                className="prose prose-zinc prose-sm max-w-none text-zinc-700 font-medium italic"
                                dangerouslySetInnerHTML={{ __html: settings.about_mission || "<p>Providenciar segurança...</p>" }}
                            />
                        </section>
                    </div>

                </div>
            </main>
        </div>
    )
}
