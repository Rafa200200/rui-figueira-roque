import { Metadata } from "next"
import Link from "next/link"
import { Building2, ShieldCheck, Mail, Eye, ArrowRight, MapPin } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Visão geral do sistema",
}

export const revalidate = 0

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Key Metrics
    const { count: activePropertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    const { count: activeInsurancesCount } = await supabase
        .from('insurances')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    const { count: newLeadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

    const { count: visitLeadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'visit_request')

    // 2. Fetch Recent Leads (Last 5)
    const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, name, type, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)

    // 3. Fetch Recent Properties (Last 5)
    const { data: recentProperties } = await supabase
        .from('properties')
        .select('id, title, price, municipality, district, status, business_type')
        .order('created_at', { ascending: false })
        .limit(5)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price)
    }

    const getLeadTypeLabel = (type: string) => {
        switch (type) {
            case 'visit_request': return 'Visita'
            case 'insurance_simulation': return 'Seguro'
            default: return 'Contacto'
        }
    }

    return (
        <div className="flex-1 space-y-8 w-full">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Painel de Controlo</h2>
                <p className="text-sm text-muted-foreground">Bem-vindo ao backoffice da Rui Figueira & Roque.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Imóveis Ativos</CardTitle>
                        <Building2 className="h-4 w-4 text-brand-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{activePropertiesCount || 0}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-semibold">Listagem Imobiliária</p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Seguros Ativos</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-brand-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{activeInsurancesCount || 0}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-semibold">Ofertas Ativas</p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-red-100 bg-red-50/30 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-red-400">Leads p/ Responder</CardTitle>
                        <Mail className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{newLeadsCount || 0}</div>
                        <p className="text-[10px] text-red-400 mt-1 font-semibold">
                            <Link href="/admin/leads" className="hover:underline flex items-center gap-1">Ver Caixa de Entrada <ArrowRight className="h-3 w-3" /></Link>
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pedidos de Visita</CardTitle>
                        <Eye className="h-4 w-4 text-brand-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{visitLeadsCount || 0}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 font-semibold">Total Histórico</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
                {/* Oportunidades Recentes */}
                <Card className="col-span-full lg:col-span-7 flex flex-col rounded-xl border-border shadow-sm">
                    <CardHeader className="border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Oportunidades Recentes</CardTitle>
                                <CardDescription className="text-xs">Últimas interações recebidas.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild className="text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg">
                                <Link href="/admin/leads">Ver Todas</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <div className="divide-y divide-border">
                            {recentLeads && recentLeads.length > 0 ? recentLeads.map(lead => (
                                <div key={lead.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors group">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-bold text-foreground">{lead.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{getLeadTypeLabel(lead.type)}</span>
                                            <span className="text-muted-foreground/30">•</span>
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {format(new Date(lead.created_at), "dd MMM, HH:mm", { locale: pt })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {lead.status === 'new' && <Badge variant="destructive" className="rounded-full px-2 h-5 text-[9px] uppercase font-bold tracking-wider">Pendente</Badge>}
                                        {lead.status === 'in_progress' && <Badge variant="warning" className="rounded-full px-2 h-5 text-[9px] uppercase font-bold tracking-wider">Em curso</Badge>}
                                        {lead.status === 'closed' && <Badge variant="success" className="rounded-full px-2 h-5 text-[9px] uppercase font-bold tracking-wider opacity-60">Resolvida</Badge>}
                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg group-hover:bg-background group-hover:shadow-sm">
                                            <Link href={`/admin/leads?open=${lead.id}`}><ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-sm text-center text-muted-foreground py-12">
                                    Nenhuma oportunidade recebida ainda.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Imóveis Recentes */}
                <Card className="col-span-full lg:col-span-5 flex flex-col rounded-xl border-border shadow-sm">
                    <CardHeader className="border-b border-border pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Últimos Imóveis</CardTitle>
                                <CardDescription className="text-xs">Novas entradas no sistema.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                                <Link href="/admin/imoveis"><ArrowRight className="h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <div className="divide-y divide-border">
                            {recentProperties && recentProperties.length > 0 ? recentProperties.map(prop => (
                                <Link href={`/admin/imoveis/${prop.id}/editar`} key={prop.id} className="flex flex-col group px-6 py-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col gap-1 pr-4 min-w-0">
                                            <p className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors truncate">
                                                {prop.title}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] px-1.5 h-4 font-bold border-border text-muted-foreground uppercase bg-background">
                                                    {prop.business_type === 'sale' ? 'Venda' : 'Arrendamento'}
                                                </Badge>
                                                <span className="text-muted-foreground/30">•</span>
                                                <div className="text-[10px] text-muted-foreground flex items-center gap-1 truncate font-medium">
                                                    <MapPin className="h-3 w-3" />
                                                    {prop.municipality}, {prop.district}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-foreground">
                                                {formatPrice(prop.price)}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-sm text-center text-muted-foreground py-12">
                                    Nenhum imóvel registado.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
