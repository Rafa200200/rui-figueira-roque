import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { LeadDetailView } from "./lead-detail-view"

export const metadata: Metadata = {
    title: "Detalhe da Lead",
    description: "Visualizar detalhe de contacto",
}

export const revalidate = 0

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Buscamos a lead específica
    const { data: lead, error } = await supabase
        .from("leads")
        .select(`
      *,
      properties (title, price, municipality, district),
      insurances (name)
    `)
        .eq("id", params.id)
        .single()

    if (error || !lead) {
        console.error("Error fetching lead:", error)
        notFound()
    }

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto space-y-6">
            <LeadDetailView lead={lead} />
        </div>
    )
}
