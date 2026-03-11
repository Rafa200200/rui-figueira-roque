"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import {
    Mail,
    MapPin,
    ShieldCheck,
    Search,
    MoreHorizontal,
    Eye,
    CheckCircle2,
    Clock,
    Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

export function LeadsInbox({ initialLeads }: { initialLeads: any[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const openId = searchParams.get('open')

    const [searchTerm, setSearchTerm] = React.useState("")
    const [filterType, setFilterType] = React.useState("all")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [selectedLead, setSelectedLead] = React.useState<any | null>(null)
    const [isUpdating, setIsUpdating] = React.useState(false)
    const [internalNotes, setInternalNotes] = React.useState("")

    const filteredLeads = initialLeads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === "all" || lead.type === filterType
        const matchesStatus = filterStatus === "all" || lead.status === filterStatus

        return matchesSearch && matchesType && matchesStatus
    })

    React.useEffect(() => {
        if (openId && initialLeads.length > 0) {
            const leadToOpen = initialLeads.find(l => l.id === openId)
            if (leadToOpen) {
                setSelectedLead(leadToOpen)
                setInternalNotes(leadToOpen.internal_notes || "")
                if (leadToOpen.status === 'new') {
                    handleStatusChange(leadToOpen.id, 'in_progress')
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openId, initialLeads])

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

    const getLeadReference = (lead: any) => {
        if (lead.properties?.title) return `Imóvel: ${lead.properties.title}`
        if (lead.insurances?.name) return `Seguro: ${lead.insurances.name}`
        return '-'
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        setIsUpdating(true)
        const supabase = createClient()
        await supabase.from("leads").update({ status: newStatus }).eq("id", id)

        if (selectedLead && selectedLead.id === id) {
            setSelectedLead({ ...selectedLead, status: newStatus })
        }

        setIsUpdating(false)
        router.refresh()
    }

    const saveInternalNotes = async () => {
        if (!selectedLead) return
        setIsUpdating(true)
        const supabase = createClient()
        await supabase.from("leads").update({ internal_notes: internalNotes }).eq("id", selectedLead.id)
        setSelectedLead({ ...selectedLead, internal_notes: internalNotes })
        setIsUpdating(false)
        router.refresh()
    }

    const handleDeleteLead = async (id: string) => {
        setIsUpdating(true)
        const supabase = createClient()
        const { error } = await supabase.from("leads").delete().eq("id", id)

        if (error) {
            alert("Erro ao eliminar o pedido.")
        } else {
            if (selectedLead?.id === id) {
                setSelectedLead(null)
            }
            router.refresh()
        }
        setIsUpdating(false)
    }

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
        <div className="space-y-0">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-border bg-muted/30">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar por nome ou email..."
                        className="pl-10 h-10 rounded-lg border-input bg-background focus-visible:ring-brand-primary focus-visible:border-brand-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3">
                    <select
                        className="flex h-10 rounded-lg border border-input bg-background dark:bg-zinc-900 px-3 py-1 text-sm font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary min-w-[160px] cursor-pointer"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Todos os Tipos</option>
                        <option value="contact">Contactos Gerais</option>
                        <option value="visit_request">Pedidos de Visita</option>
                        <option value="insurance_simulation">Simulações de Seguro</option>
                    </select>

                    <select
                        className="flex h-10 rounded-lg border border-input bg-background dark:bg-zinc-900 px-3 py-1 text-sm font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary min-w-[160px] cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Todos os Estados</option>
                        <option value="new">Novas (Por ler)</option>
                        <option value="in_progress">Em Tratamento</option>
                        <option value="closed">Fechadas</option>
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border">
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-6">Data</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-6">Remetente</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-6">Tipo de Pedido</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-6">Referência</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-6">Estado</TableHead>
                            <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-6">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-text-muted">
                                    Nenhuma oportunidade encontrada com os filtros atuais.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id} className={cn(
                                    "border-border transition-colors hover:bg-muted/50 group",
                                    lead.status === 'new' ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                                )}>
                                    <TableCell className="whitespace-nowrap px-6 py-4">
                                        <div className="text-[11px] font-bold text-muted-foreground uppercase">
                                            {format(new Date(lead.created_at), "dd MMM", { locale: pt })}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-medium">
                                            {format(new Date(lead.created_at), "HH:mm", { locale: pt })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="font-bold text-foreground line-clamp-1">{lead.name}</div>
                                        <div className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">{lead.email}</div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-muted group-hover:bg-background transition-colors">
                                                {getLeadTypeIcon(lead.type)}
                                            </div>
                                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{getLeadTypeLabel(lead.type)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="text-[10px] font-bold text-brand-primary uppercase truncate max-w-[180px]">
                                            {getLeadReference(lead)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        {lead.status === 'new' && <Badge variant="destructive" className="rounded-full px-2.5 h-6 text-[9px] font-bold uppercase tracking-wider">Pendente</Badge>}
                                        {lead.status === 'in_progress' && <Badge variant="warning" className="rounded-full px-2.5 h-6 text-[9px] font-bold uppercase tracking-wider">Em curso</Badge>}
                                        {lead.status === 'closed' && <Badge variant="success" className="rounded-full px-2.5 h-6 text-[9px] font-bold uppercase tracking-wider opacity-60">Resolvida</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <Dialog open={selectedLead?.id === lead.id} onOpenChange={(open) => {
                                                if (!open) {
                                                    setSelectedLead(null)
                                                    if (openId) {
                                                        const params = new URLSearchParams(searchParams.toString())
                                                        params.delete('open')
                                                        router.replace(`/admin/leads?${params.toString()}`)
                                                    }
                                                }
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 rounded-lg px-3 text-muted-foreground hover:text-foreground hover:bg-accent font-bold text-[10px] uppercase tracking-wider bg-muted/50 group-hover:bg-background border border-transparent group-hover:border-border"
                                                        onClick={() => {
                                                            setSelectedLead(lead)
                                                            setInternalNotes(lead.internal_notes || "")
                                                            // Automatically mark as in progress if it was new and is being opened
                                                            if (lead.status === 'new') {
                                                                handleStatusChange(lead.id, 'in_progress')
                                                            }
                                                        }}
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-2" />
                                                        Detalhes
                                                    </Button>
                                                </DialogTrigger>
                                                {selectedLead?.id === lead.id && (
                                                    <DialogContent className="max-w-3xl rounded-2xl border-border shadow-2xl p-0 overflow-hidden text-foreground">
                                                        {selectedLead && (
                                                            <div className="flex flex-col h-full max-h-[90vh]">
                                                                <div className="p-6 border-b border-border bg-muted/50">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                        <div>
                                                                            <div className="flex items-center gap-3 mb-1">
                                                                                <div className="p-2 rounded-xl bg-background border border-border shadow-sm">
                                                                                    {getLeadTypeIcon(selectedLead.type)}
                                                                                </div>
                                                                                <DialogTitle className="text-xl font-bold leading-none">
                                                                                    {getLeadTypeLabel(selectedLead.type)}
                                                                                </DialogTitle>
                                                                            </div>
                                                                            <DialogDescription className="text-xs font-medium text-muted-foreground pl-[44px]">
                                                                                Recebida em {format(new Date(selectedLead.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: pt })}
                                                                            </DialogDescription>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider"
                                                                                onClick={() => handleDeleteLead(selectedLead.id)}
                                                                                disabled={isUpdating}
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-2" /> Apagar
                                                                            </Button>

                                                                            {selectedLead.status !== 'closed' && (
                                                                                <Button size="sm" className="bg-foreground border-foreground hover:bg-foreground/90 text-background h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm" onClick={() => handleStatusChange(selectedLead.id, 'closed')} disabled={isUpdating}>
                                                                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Finalizar
                                                                                </Button>
                                                                            )}
                                                                            {selectedLead.status === 'closed' && (
                                                                                <Button size="sm" variant="outline" className="border-border text-muted-foreground h-9 rounded-lg font-bold text-[10px] uppercase tracking-wider" onClick={() => handleStatusChange(selectedLead.id, 'in_progress')} disabled={isUpdating}>
                                                                                    <Clock className="h-4 w-4 mr-2" /> Reabrir
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1 overflow-y-auto p-8">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                        {/* Left Column: Contact Info */}
                                                                        <div className="space-y-6">
                                                                            <div>
                                                                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Dados de Contacto</h4>
                                                                                <div className="bg-muted/50 border border-border p-5 rounded-xl space-y-4">
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Nome</span>
                                                                                        <p className="text-sm font-bold text-foreground">{selectedLead.name}</p>
                                                                                    </div>
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">E-mail</span>
                                                                                        <a href={`mailto:${selectedLead.email}`} className="text-sm font-bold text-brand-primary hover:underline">{selectedLead.email}</a>
                                                                                    </div>
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Telefone</span>
                                                                                        <p className="text-sm font-bold text-foreground">{selectedLead.phone || '-'}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Reference context */}
                                                                            {(selectedLead.properties || selectedLead.insurances) && (
                                                                                <div>
                                                                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Contexto do Pedido</h4>
                                                                                    <div className="bg-background border border-brand-primary/20 p-5 rounded-xl shadow-sm shadow-brand-primary/5">
                                                                                        {selectedLead.properties && (
                                                                                            <div className="space-y-3">
                                                                                                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                                                                                                    <MapPin className="h-4 w-4 text-brand-primary" />
                                                                                                    {selectedLead.properties.title}
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2 pl-6">
                                                                                                    <Badge variant="outline" className="text-[9px] font-bold uppercase border-brand-primary/20 text-brand-primary bg-brand-primary/5">Imóvel</Badge>
                                                                                                    <span className="text-[10px] font-medium text-muted-foreground">{selectedLead.properties.municipality}, {selectedLead.properties.district}</span>
                                                                                                    <span className="text-[10px] font-bold text-foreground">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(selectedLead.properties.price)}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}

                                                                                        {selectedLead.insurances && (
                                                                                            <div className="space-y-3">
                                                                                                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                                                                                                    <ShieldCheck className="h-4 w-4 text-brand-primary" />
                                                                                                    {selectedLead.insurances.name}
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
                                                                            {selectedLead.message && (
                                                                                <div>
                                                                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Mensagem do Cliente</h4>
                                                                                    <div className="bg-muted/50 border border-border p-5 rounded-xl text-sm font-medium text-foreground leading-relaxed">
                                                                                        {renderMessage(selectedLead.message)}
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {selectedLead.form_data && Object.keys(selectedLead.form_data).length > 0 && (
                                                                                <div>
                                                                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Dados Complementares</h4>
                                                                                    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
                                                                                        <div className="divide-y divide-border">
                                                                                            {Object.entries(selectedLead.form_data).map(([key, value]) => (
                                                                                                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 px-4 gap-1">
                                                                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase break-words">{key.replace(/_/g, ' ')}</span>
                                                                                                    <span className="text-xs font-bold text-foreground text-left sm:text-right break-words">{String(value)}</span>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Internal Notes */}
                                                                    <div className="mt-10 pt-8 border-t border-border">
                                                                        <div className="flex items-center gap-2 mb-4">
                                                                            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest px-1">Notas Internas</h4>
                                                                            <Badge variant="outline" className="text-[8px] border-border text-muted-foreground font-bold uppercase">Apenas Visível pela Equipa</Badge>
                                                                        </div>
                                                                        <div className="relative group/notes">
                                                                            <Textarea
                                                                                value={internalNotes}
                                                                                onChange={(e) => setInternalNotes(e.target.value)}
                                                                                placeholder="Registe aqui o acompanhamento deste pedido..."
                                                                                className="rounded-xl border-input focus-visible:ring-brand-primary focus-visible:border-brand-primary min-h-[120px] p-4 text-sm font-medium pb-14 transition-all bg-muted/30 group-focus-within/notes:bg-background"
                                                                            />
                                                                            <div className="absolute bottom-3 right-3">
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={saveInternalNotes}
                                                                                    disabled={isUpdating || internalNotes === (selectedLead.internal_notes || "")}
                                                                                    className="rounded-lg h-9 px-4 font-bold text-[10px] uppercase tracking-wider bg-brand-primary hover:bg-brand-primary/90 text-white shadow-sm"
                                                                                >
                                                                                    Guardar Notas
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                )}
                                            </Dialog>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-status-error hover:bg-status-error/10 h-8 w-8"
                                                        disabled={isUpdating}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl border-border bg-background">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-xl font-bold text-foreground">Eliminar Pedido?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                                                            Deseja eliminar permanentemente o pedido de <strong className="text-foreground">{lead.name}</strong>? Esta ação não pode ser revertida.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="gap-2 sm:gap-0">
                                                        <AlertDialogCancel className="rounded-lg h-10 font-bold text-[10px] uppercase tracking-wider border-border">Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg h-10 font-bold text-[10px] uppercase tracking-wider shadow-sm border-0"
                                                        >
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
