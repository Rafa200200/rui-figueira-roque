import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SiteSettingsForm } from "./settings-form"

export const metadata: Metadata = {
    title: "Conteúdo Institucional",
    description: "Gerir páginas, textos e informações do site",
}

export const revalidate = 0

export default async function ContentPage() {
    const supabase = await createClient()

    // Fetch all settings
    const { data: settings, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("group_name")

    if (error) {
        console.error("Error fetching site settings:", error)
    }

    return (
        <div className="flex-1 space-y-8 max-w-5xl mx-auto w-full">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Conteúdo Institucional</h2>
                <p className="text-sm text-muted-foreground">
                    Gerencie as informações, textos e imagens que aparecem no site público.
                </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-card-foreground">
                <SiteSettingsForm initialSettings={settings || []} />
            </div>
        </div>
    )
}
