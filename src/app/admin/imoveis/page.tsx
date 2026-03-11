import { Metadata } from "next"
import Link from "next/link"
import { Plus, Edit, Trash2, Home, MapPin } from "lucide-react"

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
    title: "Gestão de Imóveis",
    description: "Gerir propriedades",
}

export const revalidate = 0 // Disable cache for admin pages

export default async function PropertiesPage() {
    const supabase = await createClient()

    const { data: properties, error } = await supabase
        .from("properties")
        .select(`
      id,
      title,
      price,
      typology,
      status,
      municipality,
      district,
      business_type,
      property_images (url)
    `)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching properties:", error)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price)
    }

    return (
        <div className="flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Imóveis</h2>
                    <p className="text-sm text-muted-foreground">Administre o seu portfólio imobiliário aqui.</p>
                </div>
                <Button asChild className="rounded-lg bg-brand-primary hover:bg-brand-primary/90 shadow-sm font-semibold h-11 px-6 transition-all text-white">
                    <Link href="/admin/imoveis/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Imóvel
                    </Link>
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border">
                            <TableHead className="w-[100px] text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Foto</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dados do Imóvel</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preço</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado</TableHead>
                            <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!properties || properties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col justify-center items-center text-text-muted">
                                        <Home className="h-8 w-8 mb-2 opacity-50" />
                                        <p>Nenhum imóvel encontrado.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            properties.map((property: any) => {
                                const coverImage = property.property_images?.[0]?.url || "https://placehold.co/100x100?text=Sem+Foto"

                                return (
                                    <TableRow key={property.id} className="border-border hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="h-14 w-20 overflow-hidden rounded-lg bg-muted border border-border shadow-xs">
                                                <img
                                                    src={coverImage}
                                                    alt={property.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-foreground line-clamp-1">{property.title}</div>
                                            <div className="flex items-center gap-2 mt-1.5 min-w-0">
                                                <Badge variant="outline" className="rounded-md border-border bg-background text-muted-foreground font-bold text-[9px] uppercase h-4 px-1.5 leading-none">
                                                    {property.business_type === 'sale' ? 'Venda' : 'Arrendamento'}
                                                </Badge>
                                                <span className="text-muted-foreground/30">|</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{property.typology}</span>
                                                <span className="text-muted-foreground/30">|</span>
                                                <div className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 truncate max-w-[150px]">
                                                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                                                    {property.municipality}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-foreground">
                                            {formatPrice(property.price)}
                                        </TableCell>
                                        <TableCell>
                                            {property.status === 'active' && <Badge variant="success" className="rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider">Ativo</Badge>}
                                            {property.status === 'suspended' && <Badge variant="warning" className="rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider">Suspenso</Badge>}
                                            {property.status === 'draft' && <Badge variant="outline" className="rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider border-border text-muted-foreground">Rascunho</Badge>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-lg hover:bg-muted/80">
                                                    <Link href={`/admin/imoveis/${property.id}/editar`} title="Editar">
                                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                                    </Link>
                                                </Button>
                                                <DeleteButton table="properties" id={property.id} title={property.title} />
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
