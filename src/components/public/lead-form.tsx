"use client"

import { useState } from "react"
import { submitLead } from "@/app/actions/leads"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

interface LeadFormProps {
    type: "contact" | "visit_request" | "insurance_simulation" | "credit"
    propertyId?: string
    insuranceId?: string
    title?: string
    buttonText?: string
    buttonColor?: string
    dynamicFields?: any[]
}

export function LeadForm({
    type,
    propertyId,
    insuranceId,
    title = "Entre em Contacto",
    buttonText = "Enviar Pedido",
    buttonColor = "bg-brand-dark hover:bg-zinc-800",
    dynamicFields = []
}: LeadFormProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus("loading")

        const formData = new FormData(e.currentTarget)

        formData.append("type", type)
        if (propertyId) formData.append("property_id", propertyId)
        if (insuranceId) formData.append("insurance_id", insuranceId)

        const result = await submitLead(formData)

        if (result.success) {
            setStatus("success")
            setMessage("Obrigado! Recebemos o seu pedido e entraremos em contacto em breve.")
            e.currentTarget.reset()
        } else {
            setStatus("error")
            setMessage(result.error || "Ocorreu um erro ao enviar. Por favor tente novamente.")
        }
    }

    if (status === "success") {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border border-green-100 dark:border-green-800 text-center space-y-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">Enviado com Sucesso!</h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                    {message}
                </p>
                <Button variant="outline" onClick={() => setStatus("idle")} className="mt-4">
                    Enviar outro pedido
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {dynamicFields && dynamicFields.length > 0 ? (
                // DYNAMIC FIELDS
                <div className="space-y-4">
                    {dynamicFields.map((field, idx) => (
                        <div key={idx} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">{field.label}</label>
                            {field.type === "multiline" ? (
                                <textarea
                                    name={field.id}
                                    required={field.required}
                                    placeholder={field.label}
                                    rows={3}
                                    className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none text-zinc-900"
                                />
                            ) : field.type === "select" ? (
                                <select
                                    name={field.id}
                                    required={field.required}
                                    className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900 appearance-none cursor-pointer"
                                >
                                    <option value="">Selecione...</option>
                                    {(Array.isArray(field.options) ? field.options : typeof field.options === 'string' ? field.options.split(',') : []).map((opt: string) => (
                                        <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    name={field.id}
                                    type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : field.type === 'date' ? 'date' : 'text'}
                                    required={field.required}
                                    placeholder={field.label}
                                    className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900"
                                />
                            )}
                        </div>
                    ))}

                    {/* Auto-inject contact fields if the admin forgot to add them */}
                    {!dynamicFields.some(f => f.type === 'email' || f.id.toLowerCase().includes('email')) && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email (Contacto)</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="O seu email"
                                className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900"
                            />
                        </div>
                    )}

                    {!dynamicFields.some(f => f.type === 'tel' || f.id.toLowerCase().includes('telefone') || f.id.toLowerCase().includes('telemovel')) && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Telefone (Contacto)</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                placeholder="O seu contacto numérico"
                                className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900"
                            />
                        </div>
                    )}
                </div>
            ) : (
                // DEFAULT FIELDS
                <>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nome Completo</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="O seu nome"
                            className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="O seu email"
                                className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Telefone</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                placeholder="O seu contacto"
                                className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900"
                            />
                        </div>
                    </div>

                    {type === "contact" && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Assunto</label>
                            <select
                                name="subject"
                                className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all text-zinc-900 appearance-none cursor-pointer"
                            >
                                <option value="Informações Gerais">Informações Gerais</option>
                                <option value="Imobiliária">Imobiliária</option>
                                <option value="Seguros">Seguros</option>
                                <option value="Crédito Bancário">Crédito Bancário</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Mensagem / Observações</label>
                        <textarea
                            name="message"
                            rows={type === "insurance_simulation" ? 3 : 2}
                            placeholder={type === "insurance_simulation" ? "Ex: Matrícula, Data de Nascimento, etc." : "Gostaria de agendar uma visita para..."}
                            className="w-full p-3 rounded-lg border border-zinc-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none text-zinc-900"
                        />
                    </div>
                </>
            )}

            {status === "error" && (
                <p className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded border border-red-100 italic">
                    {message}
                </p>
            )}

            <Button
                type="submit"
                disabled={status === "loading"}
                className={`w-full h-10 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${buttonColor}`}
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> A enviar...
                    </>
                ) : (
                    <>
                        {buttonText} <ArrowRight className="h-4 w-4" />
                    </>
                )}
            </Button>

            <p className="text-[10px] text-zinc-400 text-center px-4 mt-4 leading-tight">
                Ao enviar, aceita a nossa política de privacidade e o tratamento dos seus dados para fins de contacto comercial.
            </p>
        </form>
    )
}
