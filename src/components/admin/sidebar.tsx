"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Building2,
    LayoutDashboard,
    ShieldCheck,
    Mail,
    Settings,
    LogOut,
    Menu,
    FileText
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Imóveis", href: "/admin/imoveis", icon: Building2 },
    { name: "Seguros", href: "/admin/seguros", icon: ShieldCheck },
    { name: "Conteúdo", href: "/admin/conteudo", icon: FileText },
    { name: "Leads", href: "/admin/leads", icon: Mail },
    { name: "Definições", href: "/admin/definicoes", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    const NavLinks = () => (
        <div className="space-y-1">
            {navigation.map((item) => {
                const isActive =
                    item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href)

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all duration-200 group relative",
                            isActive
                                ? "bg-foreground text-background rounded-lg shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                        )}
                    >
                        {isActive && <div className="absolute left-0 w-1 h-5 bg-brand-primary rounded-r-full" />}
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-brand-primary" : "text-zinc-400 group-hover:text-zinc-900")} />
                        {item.name}
                    </Link>
                )
            })}
        </div>
    )

    return (
        <>
            {/* Mobile Header & Toggle */}
            <div className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
                <span className="font-semibold text-brand-dark">Backoffice</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            {/* Sidebar Desktop & Mobile */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0 shadow-xl md:shadow-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-6">
                    <Link href="/admin" className="flex flex-col">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] leading-none mb-1">Backoffice</span>
                        <span className="font-bold text-foreground text-sm tracking-tight">Rui Figueira & Roque</span>
                    </Link>
                    <Button
                        className="md:hidden"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Fechar</span>
                        &times;
                    </Button>
                </div>

                <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4 md:p-6">
                    <nav className="flex flex-col">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Menu Principal</p>
                        <NavLinks />
                    </nav>

                    <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 rounded-lg border-border text-muted-foreground hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:border-red-100 dark:hover:border-red-900/50 font-semibold"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Terminar Sessão
                        </Button>
                        <div className="flex items-center justify-between px-2 pt-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tema</span>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
