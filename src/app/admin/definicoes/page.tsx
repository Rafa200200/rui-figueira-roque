import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "./settings-form"

export const metadata: Metadata = {
    title: "Definições de Conta",
    description: "Gerir definições da conta de administrador",
}

export const revalidate = 0

export default async function SettingsPage() {
    const supabase = await createClient()

    // Fetch the currently logged-in user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error("Error fetching user data:", error)
    }

    return (
        <div className="flex-1 space-y-6 max-w-5xl mx-auto w-full">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-brand-dark">Definições da Conta</h2>
                <p className="text-sm text-text-muted">
                    Faça a gestão dos seus dados de acesso ao painel de administração.
                </p>
            </div>

            <div className="rounded-md border bg-background p-6">
                <SettingsForm userEmail={user?.email} />
            </div>
        </div>
    )
}
