"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const loginSchema = z.object({
    email: z.string().email({
        message: "Email inválido.",
    }),
    password: z.string().min(6, {
        message: "A password deve ter pelo menos 6 caracteres.",
    }),
})

type FormData = z.infer<typeof loginSchema>

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function LoginForm({ className, ...props }: LoginFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)

    const from = searchParams.get("redirect") || null

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    })

    const destinationRef = React.useRef<string>("/")

    async function onSubmit(data: FormData) {
        setIsLoading(true)
        setError(null)

        const supabase = createClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        setIsLoading(false)

        if (signInError) {
            return setError("Credenciais inválidas. Tente novamente.")
        }

        const destination = from || destinationRef.current

        // "Entrar no Site" opens homepage in a new window
        if (!from && destinationRef.current === "/") {
            window.open(destination, "_blank")
            router.refresh()
        } else {
            router.push(destination)
            router.refresh()
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="nome@exemplo.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-status-error">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            disabled={isLoading}
                            {...register("password")}
                        />
                        {errors?.password && (
                            <p className="px-1 text-xs text-status-error">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 text-sm rounded bg-status-error/10 text-status-error">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-2 mt-2">
                        <Button
                            disabled={isLoading}
                            type="button"
                            onClick={() => {
                                destinationRef.current = "/"
                                handleSubmit(onSubmit)()
                            }}
                        >
                            {isLoading && destinationRef.current === "/" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Entrar no Site
                        </Button>
                        <Button
                            disabled={isLoading}
                            type="button"
                            variant="outline"
                            onClick={() => {
                                destinationRef.current = "/admin"
                                handleSubmit(onSubmit)()
                            }}
                        >
                            {isLoading && destinationRef.current === "/admin" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Entrar no Backoffice
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
