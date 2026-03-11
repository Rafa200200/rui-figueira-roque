"use client"

import * as React from "react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import {
    Mail,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Trash2,
    ArrowLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function LeadDetailView({ lead: initialLead }: { lead: any }) {
    const router = useRouter()
    const [lead, setLead] = React.useState(initialLead)
    const [isUpdating, setIsUpdating] = React.useState(false)
    const [internalNotes, setInternalNotes] = React.useState(initialLead.internal_notes || "")

    const getLeadTypeIcon = (type: string) => {
        switch (type) {
            case 'visit_request': return <MapPin className="h-4 w-4 text-blue-500" />
            case 'insurance_simulation': return <ShieldCheck className="h-4 w-4 text-green-500" />
            default: return <Mail className="h-4 w-4 text-brand-primary" />
        }
    }

    const getLeadTypeLabel = (type: string) => {
        switch (type) {
            case 'visit_request': return 'Pedido de Visita'
            case 'insurance_simulation': return 'Simulação de Seguro'
            default: return 'Contacto Geral'
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true)
        const supabase = createClient()
        await supabase.from("leads").update({ status: newStatus }).eq("id", lead.id)
        setLead({ ...lead, status: newStatus })
        setIsUpdating(false)
        router.refresh()
    }

    const saveInternalNotes = async () => {
        setIsUpdating(true)
        const supabase = createClient()
        await supabase.from("leads").update({ internal_notes: internalNotes }).eq("id", lead.id)
        setLead({ ...lead, internal_notes: internalNotes })
        setIsUpdating(false)
        router.refresh()
    }

    const handleDeleteLead = async () => {
        setIsUpdating(true)
        const supabase = createClient()
        const { error } = await supabase.from("leads").delete().eq("id", lead.id)

        if (error) {
            alert("Erro ao eliminar o pedido.")
            setIsUpdating(false)
        } else {
            router.push('/admin/leads')
            router.refresh()
        }
    }

    React.useEffect(() => {
        if (lead.status === 'new') {
            handleStatusChange('in_progress')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderMessage = (message: string | null) => {
        if (!message) return null;

        return message.split('\n').map((line, i) => {
            const separatorIndex = line.indexOf(': ');

            if (separatorIndex !== -1) {
                const label = line.substring(0, separatorIndex);
                const value = line.substring(separatorIndex + 2);
                return (
                    <div key={i} className="mb-2 last:mb-0">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase mr-2">{label}:</span>
                        <strong className="text-zinc-900 font-bold text-sm">{value}</strong>
                    </div>
                );
            }

            return <div key={i} className="mb-2 last:mb-0">{line}</div>;
        });
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-4 lg:p-6 border-b border-zinc-100 bg-zinc-50/50">
                <Button variant="ghost" size="icon" asChild className="shrink-0 h-9 w-9 rounded-lg hover:bg-white shrink-0">
                    <Link href="/admin/leads"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-sm">
                                {getLeadTypeIcon(lead.type)}
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 leading-none">
                                {getLeadTypeLabel(lead.type)}
                            </h2>
                            {lead.status === 'in_progress' && <Badge variant="warning" className="rounded-full px-2.5 h-6 text-[9px] font-bold uppercase tracking-wider ml-2">Em curso</Badge>}
                            {lead.status === 'closed' && <Badge variant="success" className="rounded-full px-2.5 h-6 text-[9px] font-bold uppercase tracking-wider opacity-60 ml-2">Resolvida</Badge>}
                        </div>
                        <p className="text-xs font-medium text-zinc-400 pl-[44px]">
                            Recebida em {format(new Date(lead.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: pt })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider"
                                    disabled={isUpdating}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Apagar
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-zinc-200">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold text-zinc-900">Eliminar Pedido?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm font-medium text-zinc-500">
                                        Deseja eliminar permanentemente o pedido de <strong className="text-zinc-900">{lead.name}</strong>? Esta ação não pode ser revertida.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2 sm:gap-0">
                                    <AlertDialogCancel className="rounded-lg h-10 font-bold text-[10px] uppercase tracking-wider border-zinc-200">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteLead}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg h-10 font-bold text-[10px] uppercase tracking-wider shadow-sm border-0"
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {lead.status !== 'closed' && (
                            <Button size="sm" className="bg-zinc-900 border-zinc-900 hover:bg-zinc-800 text-white h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm" onClick={() => handleStatusChange('closed')} disabled={isUpdating}>
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Finalizar
                            </Button>
                        )}
                        {lead.status === 'closed' && (
                            <Button size="sm" variant="outline" className="border-zinc-200 text-zinc-600 h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider" onClick={() => handleStatusChange('in_progress')} disabled={isUpdating}>
                                <Clock className="h-4 w-4 mr-2" /> Reabrir
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-1">Dados de Contacto</h4>
                            <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-xl space-y-4">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Nome</span>
                                    <p className="text-sm font-bold text-zinc-900">{lead.name}</p>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">E-mail</span>
                                    <a href={`mailto:${lead.email}`} className="text-sm font-bold text-brand-primary hover:underline">{lead.email}</a>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Telefone</span>
                                    <p className="text-sm font-bold text-zinc-900">{lead.phone || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reference context */}
                        {(lead.properties || lead.insurances) && (
                            <div>
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-1">Contexto do Pedido</h4>
                                <div className="bg-white border border-brand-primary/20 p-5 rounded-xl shadow-sm shadow-brand-primary/5">
                                    {lead.properties && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
                                                <MapPin className="h-4 w-4 text-brand-primary" />
                                                {lead.properties.title}
                                            </div>
                                            <div className="flex items-center gap-2 pl-6">
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase border-brand-primary/20 text-brand-primary bg-brand-primary/5">Imóvel</Badge>
                                                <span className="text-[10px] font-medium text-zinc-500">{lead.properties.municipality}, {lead.properties.district}</span>
                                                <span className="text-[10px] font-bold text-zinc-900">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(lead.properties.price)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {lead.insurances && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 font-bold text-zinc-900 text-sm">
                                                <ShieldCheck className="h-4 w-4 text-brand-primary" />
                                                {lead.insurances.name}
                                            </div>
                                            <div className="flex items-center gap-2 pl-6">
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase border-brand-primary/20 text-brand-primary bg-brand-primary/5">Seguro</Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Content */}
                    <div className="space-y-6">
                        {lead.message && (
                            <div>
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-1">Mensagem do Cliente</h4>
                                <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-xl text-sm font-medium text-zinc-600 leading-relaxed">
                                    {renderMessage(lead.message)}
                                </div>
                            </div>
                        )}

                        {lead.form_data && Object.keys(lead.form_data).length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-1">Dados Complementares</h4>
                                <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
                                    <div className="divide-y divide-zinc-50">
                                        {Object.entries(lead.form_data).map(([key, value]) => (
                                            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 gap-1">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase break-words">{key.replace(/_/g, ' ')}</span>
                                                <span className="text-xs font-bold text-zinc-700 text-left sm:text-right break-words">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Internal Notes */}
                <div className="mt-10 pt-8 border-t border-zinc-100">
                    <div className="flex items-center gap-2 mb-4">
                        <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest px-1">Notas Internas</h4>
                        <Badge variant="outline" className="text-[8px] border-zinc-100 text-zinc-400 font-bold uppercase">Apenas Visível pela Equipa</Badge>
                    </div>
                    <div className="relative group/notes">
                        <Textarea
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Registe aqui o acompanhamento deste pedido..."
                            className="rounded-xl border-zinc-200 focus-visible:ring-brand-primary focus-visible:border-brand-primary min-h-[120px] p-4 text-sm font-medium pb-14 transition-all bg-zinc-50/30 group-focus-within/notes:bg-white"
                        />
                        <div className="absolute bottom-3 right-3">
                            <Button
                                size="sm"
                                onClick={saveInternalNotes}
                                disabled={isUpdating || internalNotes === (lead.internal_notes || "")}
                                className="rounded-lg h-9 px-4 font-bold text-[10px] uppercase tracking-wider bg-brand-primary hover:bg-brand-primary/90 text-white shadow-sm"
                            >
                                Guardar Notas
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
