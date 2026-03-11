import Link from "next/link"
import { MapPin, Phone, Clock, Facebook, Instagram, Linkedin, Home } from "lucide-react"

export function Footer({ settings }: { settings: Record<string, string> }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-dark text-white pt-24 pb-12">
            <div className="container mx-auto px-4 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
                {/* Brand Column */}
                <div className="space-y-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-white">
                            Rui Figueira <span className="text-brand-primary">&</span> Roque Lda
                        </span>
                    </Link>
                    <p className="text-zinc-400 font-medium leading-relaxed">
                        A sua parceira de confiança no mercado imobiliário e mediação de seguros. Especialistas em encontrar a melhor solução para o seu caso.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        {settings.social_facebook && (
                            <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                <Facebook className="h-4 w-4" />
                            </a>
                        )}
                        {settings.social_instagram && (
                            <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                <Instagram className="h-4 w-4" />
                            </a>
                        )}
                        {settings.social_linkedin && (
                            <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                <Linkedin className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Links Column */}
                <div className="space-y-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 pb-3 border-b border-white/5">Navegação</h3>
                    <ul className="space-y-3 text-sm font-semibold text-zinc-400">
                        <li><Link href="/" className="hover:text-brand-primary transition-colors">Início</Link></li>
                        <li><Link href="/imoveis" className="hover:text-brand-primary transition-colors">Imóveis para Venda</Link></li>
                        <li><Link href="/imoveis?type=rent" className="hover:text-brand-primary transition-colors">Arrendamento</Link></li>
                        <li><Link href="/seguros" className="hover:text-brand-primary transition-colors">Simulação de Seguros</Link></li>
                        <li><Link href="/credito-bancario" className="hover:text-brand-primary transition-colors">Crédito Automóvel & Habitação</Link></li>

                    </ul>
                </div>

                {/* Contact Column */}
                <div className="space-y-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 pb-3 border-b border-white/5">Contactos</h3>
                    <ul className="space-y-5 text-sm">
                        {settings.footer_address && (
                            <li className="flex items-start gap-3 text-zinc-400">
                                <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-brand-primary shrink-0">
                                    <MapPin className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-medium leading-relaxed">{settings.footer_address}</span>
                            </li>
                        )}

                        <li className="space-y-3">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-brand-primary shrink-0">
                                    <Phone className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase text-white/30 tracking-wider mb-0.5">Imobiliária</span>
                                    <a href={`tel:${settings.contact_realestate_phone}`} className="font-semibold text-white hover:text-brand-primary transition-colors">{settings.contact_realestate_phone}</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-400">
                                <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-brand-primary shrink-0">
                                    <Phone className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase text-white/30 tracking-wider mb-0.5">Seguros</span>
                                    <a href={`tel:${settings.contact_insurance_phone}`} className="font-semibold text-white hover:text-brand-primary transition-colors">{settings.contact_insurance_phone}</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Hours Column */}
                <div className="space-y-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 pb-3 border-b border-white/5">Atendimento</h3>
                    <div className="flex items-start gap-3 text-zinc-400">
                        <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-brand-primary shrink-0">
                            <Clock className="h-3.5 w-3.5" />
                        </div>
                        <div className="font-medium space-y-1 text-sm">
                            {settings.footer_hours ? (
                                <span>{settings.footer_hours}</span>
                            ) : (
                                <>
                                    <p className="text-white font-semibold">Segunda a Sexta</p>
                                    <p>09:00 - 13:00</p>
                                    <p>14:30 - 18:30</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[9px] font-bold uppercase tracking-wider text-white/20">
                <p>&copy; {currentYear} Rui Figueira & Roque Lda. Todos os direitos reservados.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/documentos/politica-privacidade" className="hover:text-white transition-colors">Privacidade</Link>
                    <Link href="/documentos/termos" className="hover:text-white transition-colors">Termos</Link>
                    <Link href="/admin" className="hover:text-white transition-colors text-white/40">Backoffice</Link>
                </div>
            </div>
        </footer>
    )
}
