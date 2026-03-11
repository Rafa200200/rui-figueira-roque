"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Save, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

const passwordSchema = z.object({
    password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "As palavras-passe não coincidem.",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof passwordSchema>

export function SettingsForm({ userEmail }: { userEmail: string | undefined }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(passwordSchema),
    })

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const supabase = createClient()

            const { error: updateError } = await supabase.auth.updateUser({
                password: data.password
            })

            if (updateError) throw updateError

            setSuccess(true)
            reset()

            setTimeout(() => setSuccess(false), 5000)
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Ocorreu um erro ao atualizar a palavra-passe.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-xl">
            <div className="space-y-2">
                <h3 className="text-lg font-medium border-b pb-2">Detalhes da Conta</h3>
                <div className="pt-2">
                    <Label>E-mail Associado</Label>
                    <div className="mt-1 h-10 px-3 py-2 bg-foreground/5 rounded-md text-sm border font-medium text-text-muted cursor-not-allowed">
                        {userEmail || "A carregar..."}
                    </div>
                    <p className="text-xs text-text-muted mt-2">O e-mail de acesso não pode ser alterado por motivos de segurança.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Alterar Palavra-passe</h3>

                {error && (
                    <div className="p-4 bg-status-error/10 flex items-center gap-2 text-status-error rounded-md text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-status-success/10 flex items-center gap-2 text-status-success rounded-md text-sm font-medium">
                        Palavra-passe alterada com sucesso! A sua próxima sessão requer a nova palavra-passe.
                    </div>
                )}

                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Palavra-passe</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register("password")}
                        />
                        {errors.password && <p className="text-xs text-status-error">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Palavra-passe</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <p className="text-xs text-status-error">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <div className="pt-4">
                    <Button disabled={isLoading} type="submit">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Atualizar Palavra-passe
                    </Button>
                </div>
            </form>
        </div>
    )
}
