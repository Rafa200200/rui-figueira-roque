import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InsuranceForm } from "./insurance-form"

export const metadata: Metadata = {
    title: "Novo Seguro",
    description: "Configurar um novo tipo de seguro de simulação",
}

export default function NewInsurancePage() {
    return (
        <div className="flex flex-col space-y-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-6">
                <Button variant="outline" size="icon" asChild className="rounded-xl border-zinc-200 dark:border-zinc-800 h-10 w-10 shrink-0 shadow-sm">
                    <Link href="/admin/seguros">
                        <ArrowLeft className="h-5 w-5 text-zinc-500" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Novo Tipo de Seguro</h2>
                    <p className="text-xs text-zinc-400 font-medium">Configure a oferta e o formulário de simulação para novos seguros.</p>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-10 shadow-sm">
                <InsuranceForm />
            </div>
        </div>
    )
}
