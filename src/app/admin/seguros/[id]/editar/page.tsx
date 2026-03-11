import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InsuranceForm } from "../../novo/insurance-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
    title: "Editar Seguro",
    description: "Editar e configurar seguro existente",
}

export const revalidate = 0

export default async function EditInsurancePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: insurance, error } = await supabase
        .from("insurances")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !insurance) {
        notFound()
    }

    return (
        <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/seguros">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight text-brand-dark">Editar Seguro</h2>
            </div>

            <div className="rounded-md border bg-background p-6">
                <InsuranceForm initialData={insurance} />
            </div>
        </div>
    )
}
