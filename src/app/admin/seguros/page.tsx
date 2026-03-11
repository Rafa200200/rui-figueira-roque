import { Metadata } from "next"
import Link from "next/link"
import { Plus, Edit, Trash2, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { DeleteButton } from "@/components/admin/delete-button"

export const metadata: Metadata = {
    title: "Gestão de Seguros",
    description: "Gerir categorias de seguros e formulários de simulação",
}

export const revalidate = 0

export default async function InsurancesPage() {
    const supabase = await createClient()

    // Fetch insurances ordering by display_order
    const { data: insurances, error } = await supabase
        .from("insurances")
        .select("id, name, short_description, status, display_order, form_fields")
        .order("display_order", { ascending: true })

    if (error) {
        console.error("Error fetching insurances:", error)
    }

    return (
        <div className="flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Seguros</h2>
                    <p className="text-sm text-muted-foreground">Administre as suas ofertas e formulários de seguro.</p>
                </div>
                <Button asChild className="rounded-lg bg-brand-primary hover:bg-brand-primary/90 shadow-sm font-semibold h-11 px-6 transition-all text-white">
                    <Link href="/admin/seguros/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Seguro
                    </Link>
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border">
                            <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Ordem</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Seguro</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Configuração</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado</TableHead>
                            <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!insurances || insurances.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col justify-center items-center text-text-muted">
                                        <ShieldAlert className="h-8 w-8 mb-2 opacity-50" />
                                        <p>Nenhum seguro configurado.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            insurances.map((insurance: any) => {
                                const fieldsCount = Array.isArray(insurance.form_fields) ? insurance.form_fields.length : 0

                                return (
                                    <TableRow key={insurance.id} className="border-border hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-bold text-center text-muted-foreground text-xs">
                                            #{insurance.display_order}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-foreground">{insurance.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-medium line-clamp-1 mt-1">
                                                {insurance.short_description}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-md border-border bg-background text-muted-foreground font-bold text-[9px] uppercase px-1.5 h-5">
                                                {fieldsCount} campos no formulário
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {insurance.status === 'active' ? (
                                                <Badge variant="success" className="rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider">Ativo</Badge>
                                            ) : (
                                                <Badge variant="outline" className="rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider border-border text-muted-foreground">Inativo</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-lg hover:bg-muted/80">
                                                    <Link href={`/admin/seguros/${insurance.id}/editar`} title="Editar Seguro">
                                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                                    </Link>
                                                </Button>
                                                <DeleteButton table="insurances" id={insurance.id} title={insurance.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
