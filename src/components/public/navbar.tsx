import Link from "next/link"
import { Menu, Phone, Facebook, Instagram, Linkedin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar({ settings }: { settings: Record<string, string> }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">

            {/* Main Navigation */}
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-brand-dark dark:text-white">
                        Rui Figueira <span className="text-brand-primary">&</span> Roque Lda
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 lg:flex font-semibold text-sm text-zinc-600 dark:text-zinc-400">
                    <Link href="/" className="transition-colors hover:text-brand-primary text-brand-primary">Início</Link>
                    <Link href="/imoveis" className="transition-colors hover:text-brand-primary">Imóveis</Link>
                    <Link href="/seguros" className="transition-colors hover:text-brand-primary">Seguros</Link>
                    <Link href="/credito-bancario" className="transition-colors hover:text-brand-primary">Crédito</Link>

                    <Link href="/contacto" className="transition-colors hover:text-brand-primary">Contatos</Link>
                </nav>

                {/* Right Action */}
                <div className="hidden md:block">
                    <Link href="/contacto">
                        <Button className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm px-6 rounded-lg h-10 shadow-sm transition-all">
                            Solicitar Contacto
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden p-2 text-zinc-900 dark:text-zinc-100">
                    <Menu className="h-6 w-6" />
                </button>
            </div>
        </header>
    )
}
