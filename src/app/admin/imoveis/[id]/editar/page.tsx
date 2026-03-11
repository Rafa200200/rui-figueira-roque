import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PropertyForm } from "../../novo/property-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
    title: "Editar Imóvel",
    description: "Editar um imóvel existente",
}

export const revalidate = 0

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: property, error } = await supabase
        .from("properties")
        .select("*, property_images(*)")
        .eq("id", id)
        .single()

    if (error || !property) {
        notFound()
    }

    return (
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-6">
                <Button variant="outline" size="icon" asChild className="rounded-xl border-zinc-200 dark:border-zinc-800 h-10 w-10 shrink-0 shadow-sm">
                    <Link href="/admin/imoveis">
                        <ArrowLeft className="h-5 w-5 text-zinc-500" />
                    </Link>
                </Button>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Editar Imóvel</h2>
                    <p className="text-xs text-zinc-400 font-medium">Atualize as informações e detalhes técnicos do imóvel.</p>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-10 shadow-sm">
                <PropertyForm initialData={property} />
            </div>
        </div>
    )
}
