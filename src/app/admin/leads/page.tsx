import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { LeadsInbox } from "./leads-inbox"

export const metadata: Metadata = {
    title: "Caixa de Entrada (Leads)",
    description: "Gerir pedidos de contacto, visitas e simulações",
}

export const revalidate = 0

export default async function LeadsPage() {
    const supabase = await createClient()

    // Fetch all leads with related property and insurance data if any
    const { data: leads, error } = await supabase
        .from("leads")
        .select(`
      *,
      properties (title, price, municipality, district),
      insurances (name)
    `)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching leads:", error)
    }

    // Calculate some simple metrics
    const newLeads = leads?.filter(l => l.status === 'new').length || 0
    const inProgressLeads = leads?.filter(l => l.status === 'in_progress').length || 0
    const visitRequests = leads?.filter(l => l.type === 'visit_request').length || 0

    return (
        <div className="flex-1 space-y-8 w-full">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Caixa de Entrada</h2>
                <p className="text-sm text-muted-foreground">
                    Faça a gestão de pedidos de contacto, visitas e simulações.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-1">Por Tratar (Novas)</div>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">{newLeads}</div>
                </div>
                <div className="rounded-xl border border-amber-100 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider mb-1">Em Tratamento</div>
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{inProgressLeads}</div>
                </div>
                <div className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Pedidos de Visita</div>
                    <div className="text-3xl font-bold text-foreground">{visitRequests}</div>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
                <LeadsInbox initialLeads={leads || []} />
            </div>
        </div>
    )
}
