import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PropertyForm } from "./property-form"

export const metadata: Metadata = {
    title: "Novo Imóvel",
    description: "Adicionar um novo imóvel ao portefólio",
}

export default function NewPropertyPage() {
    return (
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-6">
                <Button variant="outline" size="icon" asChild className="rounded-xl border-zinc-200 h-10 w-10 shrink-0 shadow-sm">
                    <Link href="/admin/imoveis">
                        <ArrowLeft className="h-5 w-5 text-zinc-500" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Novo Imóvel</h2>
                    <p className="text-xs text-zinc-400 font-medium">Preencha os detalhes para listar um novo imóvel no portefólio.</p>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-10 shadow-sm">
                <PropertyForm />
            </div>
        </div>
    )
}
