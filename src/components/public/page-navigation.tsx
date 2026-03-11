"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageNavigationProps {
    backText?: string;
    padding?: string;
}

export function PageNavigation({ backText = "Voltar", padding = "py-6" }: PageNavigationProps) {
    const router = useRouter()

    return (
        <div className={`container mx-auto px-4 ${padding} flex items-center gap-3`}>
            <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm text-zinc-600 hover:text-brand-primary hover:border-brand-primary/30 border-zinc-200 transition-colors bg-white font-bold"
                onClick={() => router.back()}
                type="button"
            >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> {backText}
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm text-zinc-600 hover:text-brand-primary hover:border-brand-primary/30 border-zinc-200 transition-colors bg-white font-bold"
                asChild
            >
                <Link href="/">
                    <Home className="mr-1.5 h-4 w-4" /> Início
                </Link>
            </Button>
        </div>
    )
}
