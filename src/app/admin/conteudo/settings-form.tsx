"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, AlertCircle, UploadCloud, ImageIcon, RefreshCw, CheckCircle2, MapPin, Building2, ShieldCheck, Euro } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"

export function SiteSettingsForm({ initialSettings }: { initialSettings: Record<string, any> }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Convert array of settings to key-value pairs for easy editing
    const [settings, setSettings] = React.useState<Record<string, any>>(
        initialSettings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr;
            return acc;
        }, {})
    )

    // Image upload states
    const [aboutFile, setAboutFile] = React.useState<File | null>(null)
    const [aboutPreview, setAboutPreview] = React.useState<string | null>(settings['about_photo']?.value || null)
    const [heroFile, setHeroFile] = React.useState<File | null>(null)
    const [heroPreview, setHeroPreview] = React.useState<string | null>(settings['hero_image']?.value || null)

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [key]: { ...prev[key], value }
        }))
        setSuccess(false)
    }

    async function handleSave() {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const supabase = createClient()

            const currentSettings = { ...settings }

            // Upload hero banner image
            if (heroFile) {
                const fileExt = heroFile.name.split('.').pop()
                const fileName = `hero-${Date.now()}.${fileExt}`
                const filePath = `hero/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(filePath, heroFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('site-assets')
                    .getPublicUrl(filePath)

                if (currentSettings['hero_image']) {
                    currentSettings['hero_image'].value = publicUrl
                } else {
                    currentSettings['hero_image'] = { key: 'hero_image', value: publicUrl, group_name: 'homepage', type: 'image' }
                }
            }


            if (aboutFile) {
                const fileExt = aboutFile.name.split('.').pop()
                const fileName = `about-${Date.now()}.${fileExt}`
                const filePath = `about/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(filePath, aboutFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('site-assets')
                    .getPublicUrl(filePath)

                if (currentSettings['about_photo']) {
                    currentSettings['about_photo'].value = publicUrl
                } else {
                    currentSettings['about_photo'] = { key: 'about_photo', value: publicUrl, group_name: 'about', type: 'text' }
                }
            }

            // Update or Insert each setting
            // Since we added new fields, we need to handle upserts
            for (const key in currentSettings) {
                const item = currentSettings[key]

                if (item.id) {
                    // Update existing
                    await supabase
                        .from("site_settings")
                        .update({ value: item.value, updated_at: new Date().toISOString() })
                        .eq("id", item.id)
                } else if (item.value) {
                    // Insert new (from the new fields added to the form)
                    await supabase
                        .from("site_settings")
                        .insert({
                            key,
                            value: item.value,
                            type: item.type || 'text',
                            group_name: item.group_name || 'general'
                        })
                }
            }

            setSuccess(true)
            router.refresh()

            // Hide success message after 3s
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            console.error(err)
            setError("Falha ao guardar configurações.")
        } finally {
            setIsLoading(false)
        }
    }

    // Obter valor seguro com fallback
    const getValue = (key: string) => settings[key]?.value || ''

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted text-muted-foreground">
                        <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Editar Conteúdos</h2>
                        <p className="text-xs text-muted-foreground font-medium">Personalize a presença digital e a secção "Sobre Nós" na homepage</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={isLoading} className="bg-foreground hover:bg-foreground/90 text-background h-10 px-6 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Alterações
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 rounded-xl text-xs font-bold uppercase tracking-tight">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-tight">
                    <CheckCircle2 className="h-4 w-4" />
                    Configurações guardadas com sucesso! Alterações em vigor no site.
                </div>
            )}

            <Tabs defaultValue="homepage" className="w-full">
                <TabsList className="mb-8 flex-wrap bg-card border border-border p-1.5 rounded-xl h-auto w-full justify-start gap-2">
                    <TabsTrigger value="homepage" className="rounded-lg px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">Homepage (Títulos)</TabsTrigger>
                    <TabsTrigger value="about" className="rounded-lg px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">Sobre Nós (Homepage)</TabsTrigger>
                    <TabsTrigger value="contacts" className="rounded-lg px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">Contactos</TabsTrigger>
                    <TabsTrigger value="credit" className="rounded-lg px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">Crédito</TabsTrigger>
                    <TabsTrigger value="social" className="rounded-lg px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-foreground data-[state=active]:text-background">Redes Sociais</TabsTrigger>
                </TabsList>

                {/* --- HOMEPAGE TABS --- */}
                <TabsContent value="homepage" className="space-y-8 mt-0">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="hero_title" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Título Principal (Hero)</Label>
                            <Input
                                id="hero_title"
                                className="h-12 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('hero_title')}
                                onChange={(e) => handleChange('hero_title', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="hero_subtitle" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Subtítulo Explicativo</Label>
                            <Textarea
                                id="hero_subtitle"
                                className="min-h-[100px] rounded-xl border-border focus-visible:ring-brand-primary font-medium text-foreground bg-background leading-relaxed"
                                value={getValue('hero_subtitle')}
                                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                            />
                        </div>

                        {/* Hero Banner Image */}
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Imagem de Fundo do Banner</Label>
                            <div className="flex flex-col gap-6">
                                {heroPreview && (
                                    <div className="relative aspect-[3/1] w-full max-w-2xl rounded-2xl overflow-hidden border border-border bg-muted/30 shadow-sm group">
                                        <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => document.getElementById('hero-upload')?.click()}
                                                className="rounded-lg h-10 px-6 font-bold text-[10px] uppercase tracking-wider"
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Alterar Imagem
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {!heroPreview && (
                                    <div
                                        onClick={() => document.getElementById('hero-upload')?.click()}
                                        className="aspect-[3/1] w-full max-w-2xl rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors shadow-inner"
                                    >
                                        <div className="p-4 rounded-full bg-background shadow-sm mb-4">
                                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-medium mt-1">Formatos: JPG, PNG, WEBP • Recomendado: Panorâmica 1920×640 (Máx 2MB)</span>
                                    </div>
                                )}
                                <input
                                    id="hero-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setHeroFile(file)
                                            setHeroPreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                                <div className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border max-w-2xl">
                                    <Label htmlFor="hero_image_url" className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Ou cole um link direto</Label>
                                    <Input
                                        id="hero_image_url"
                                        className="h-9 px-3 text-xs border-border bg-background text-foreground rounded-lg focus-visible:ring-brand-primary"
                                        value={getValue('hero_image')}
                                        onChange={(e) => {
                                            handleChange('hero_image', e.target.value)
                                            setHeroPreview(e.target.value)
                                            setHeroFile(null)
                                        }}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>




                    </div>
                </TabsContent>

                {/* --- ABOUT US TAB --- */}
                <TabsContent value="about" className="space-y-8 mt-0">
                    <div className="grid gap-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Biografia / Apresentação</Label>
                            <div className="rounded-xl border border-border overflow-hidden shadow-sm bg-background">
                                <RichTextEditor
                                    content={getValue('about_bio')}
                                    onChange={(v) => handleChange('about_bio', v)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Fotografia de Destaque</Label>
                            <div className="flex flex-col gap-6">
                                {aboutPreview && (
                                    <div className="relative aspect-video w-full max-w-2xl rounded-2xl overflow-hidden border border-border bg-muted/30 shadow-sm group">
                                        <img src={aboutPreview} alt="About Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => document.getElementById('about-upload')?.click()}
                                                className="rounded-lg h-10 px-6 font-bold text-[10px] uppercase tracking-wider"
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Alterar Foto
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {!aboutPreview && (
                                    <div
                                        onClick={() => document.getElementById('about-upload')?.click()}
                                        className="aspect-video w-full max-w-2xl rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors shadow-inner"
                                    >
                                        <div className="p-4 rounded-full bg-background shadow-sm mb-4">
                                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-medium mt-1">Formatos: JPG, PNG, WEBP • Recomendado: Retrato (Máx 2MB)</span>
                                    </div>
                                )}
                                <input
                                    id="about-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setAboutFile(file)
                                            setAboutPreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                                <div className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border max-w-2xl">
                                    <Label htmlFor="about_photo_url" className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Ou cole um link direto</Label>
                                    <Input
                                        id="about_photo_url"
                                        className="h-9 px-3 text-xs border-border bg-background text-foreground rounded-lg focus-visible:ring-brand-primary"
                                        value={getValue('about_photo')}
                                        onChange={(e) => {
                                            handleChange('about_photo', e.target.value)
                                            setAboutPreview(e.target.value)
                                            setAboutFile(null)
                                        }}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- CONTACTS TAB (MULTI-DEP) --- */}
                <TabsContent value="contacts" className="space-y-10 mt-0">
                    {/* Informação Geral */}
                    <div className="grid gap-6 md:grid-cols-2 p-8 border border-border rounded-2xl bg-muted/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <MapPin className="h-16 w-16 text-foreground" />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 mb-2">
                            <div className="h-8 w-1.5 bg-foreground rounded-full" />
                            <h3 className="font-bold text-foreground uppercase tracking-widest text-sm">
                                Localização & Logística
                            </h3>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="footer_address" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Morada Física Central</Label>
                            <Input
                                id="footer_address"
                                className="h-11 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('footer_address')}
                                onChange={(e) => handleChange('footer_address', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="footer_hours" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Horário de Funcionamento</Label>
                            <Input
                                id="footer_hours"
                                className="h-11 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('footer_hours')}
                                onChange={(e) => handleChange('footer_hours', e.target.value)}
                                placeholder="Segunda a Sexta, 09h00 - 18h00"
                            />
                        </div>
                    </div>

                    {/* Imobiliária */}
                    <div className="grid gap-6 md:grid-cols-2 p-8 border border-brand-primary/20 rounded-2xl bg-brand-primary/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 -mr-4 -mt-4">
                            <Building2 className="h-24 w-24 text-brand-primary" />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 mb-2">
                            <div className="h-8 w-1.5 bg-brand-primary rounded-full" />
                            <h3 className="font-bold text-brand-primary uppercase tracking-widest text-sm">
                                Departamento Imobiliário
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_realestate_phone" className="text-[10px] font-bold text-brand-primary/80 uppercase tracking-widest px-1">Telefone Principal</Label>
                            <Input
                                id="contact_realestate_phone"
                                className="h-11 rounded-xl border-brand-primary/20 focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('contact_realestate_phone')}
                                onChange={(e) => {
                                    handleChange('contact_realestate_phone', e.target.value);
                                    if (!settings['contact_realestate_phone']?.type) setSettings(p => ({ ...p, contact_realestate_phone: { ...p.contact_realestate_phone, type: 'text', group_name: 'contacts' } }))
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_realestate_email" className="text-[10px] font-bold text-brand-primary/80 uppercase tracking-widest px-1">E-mail de Contacto</Label>
                            <Input
                                id="contact_realestate_email"
                                type="email"
                                className="h-11 rounded-xl border-brand-primary/20 focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('contact_realestate_email')}
                                onChange={(e) => {
                                    handleChange('contact_realestate_email', e.target.value)
                                    if (!settings['contact_realestate_email']?.type) setSettings(p => ({ ...p, contact_realestate_email: { ...p.contact_realestate_email, type: 'text', group_name: 'contacts' } }))
                                }}
                            />
                        </div>
                    </div>

                    {/* Seguros */}
                    <div className="grid gap-6 md:grid-cols-2 p-8 border border-blue-500/20 rounded-2xl bg-blue-500/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 -mr-4 -mt-4">
                            <ShieldCheck className="h-24 w-24 text-blue-500" />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 mb-2">
                            <div className="h-8 w-1.5 bg-blue-500 rounded-full" />
                            <h3 className="font-bold text-blue-500 uppercase tracking-widest text-sm">
                                Departamento de Seguros
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_insurance_phone" className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest px-1">Telefone Especializado</Label>
                            <Input
                                id="contact_insurance_phone"
                                className="h-11 rounded-xl border-blue-500/20 focus-visible:ring-blue-500 font-bold text-foreground bg-background"
                                value={getValue('contact_insurance_phone')}
                                onChange={(e) => {
                                    handleChange('contact_insurance_phone', e.target.value)
                                    if (!settings['contact_insurance_phone']?.type) setSettings(p => ({ ...p, contact_insurance_phone: { ...p.contact_insurance_phone, type: 'text', group_name: 'contacts' } }))
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_insurance_email" className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest px-1">E-mail Especializado</Label>
                            <Input
                                id="contact_insurance_email"
                                type="email"
                                className="h-11 rounded-xl border-blue-500/20 focus-visible:ring-blue-500 font-bold text-foreground bg-background"
                                value={getValue('contact_insurance_email')}
                                onChange={(e) => {
                                    handleChange('contact_insurance_email', e.target.value)
                                    if (!settings['contact_insurance_email']?.type) setSettings(p => ({ ...p, contact_insurance_email: { ...p.contact_insurance_email, type: 'text', group_name: 'contacts' } }))
                                }}
                            />
                        </div>
                    </div>

                    {/* Créditos */}
                    <div className="grid gap-6 md:grid-cols-2 p-8 border border-amber-500/20 rounded-2xl bg-amber-500/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10 -mr-4 -mt-4">
                            <Euro className="h-24 w-24 text-amber-500" />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 mb-2">
                            <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
                            <h3 className="font-bold text-amber-500 uppercase tracking-widest text-sm">
                                Intermediação de Crédito
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_credit_phone" className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest px-1">Contacto Créditos</Label>
                            <Input
                                id="contact_credit_phone"
                                className="h-11 rounded-xl border-amber-500/20 focus-visible:ring-amber-500 font-bold text-foreground bg-background"
                                value={getValue('contact_credit_phone')}
                                onChange={(e) => {
                                    handleChange('contact_credit_phone', e.target.value)
                                    if (!settings['contact_credit_phone']?.type) setSettings(p => ({ ...p, contact_credit_phone: { ...p.contact_credit_phone, type: 'text', group_name: 'contacts' } }))
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_credit_email" className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest px-1">E-mail Créditos</Label>
                            <Input
                                id="contact_credit_email"
                                type="email"
                                className="h-11 rounded-xl border-amber-500/20 focus-visible:ring-amber-500 font-bold text-foreground bg-background"
                                value={getValue('contact_credit_email')}
                                onChange={(e) => {
                                    handleChange('contact_credit_email', e.target.value)
                                    if (!settings['contact_credit_email']?.type) setSettings(p => ({ ...p, contact_credit_email: { ...p.contact_credit_email, type: 'text', group_name: 'contacts' } }))
                                }}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* --- CREDITOS TAB --- */}
                <TabsContent value="credit" className="space-y-8 mt-0">
                    <div className="grid gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="credit_bdp_number" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Registo Banco de Portugal</Label>
                            <Input
                                id="credit_bdp_number"
                                className="h-12 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('credit_bdp_number')}
                                onChange={(e) => {
                                    handleChange('credit_bdp_number', e.target.value)
                                    if (!settings['credit_bdp_number']?.type) setSettings(p => ({ ...p, credit_bdp_number: { ...p.credit_bdp_number, type: 'text', group_name: 'credit' } }))
                                }}
                                placeholder="ex: BdP 0006370"
                            />
                            <p className="text-[10px] text-amber-500 font-bold uppercase ml-1 italic">Irá aparecer em todas as menções ao Crédito por obrigatoriedade legal.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credit_bdp_link" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Link do Registo Banco de Portugal</Label>
                            <Input
                                id="credit_bdp_link"
                                className="h-12 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('credit_bdp_link')}
                                onChange={(e) => {
                                    handleChange('credit_bdp_link', e.target.value)
                                    if (!settings['credit_bdp_link']?.type) setSettings(p => ({ ...p, credit_bdp_link: { ...p.credit_bdp_link, type: 'text', group_name: 'credit' } }))
                                }}
                                placeholder="https://www.bportugal.pt/intermediariocreditic/..."
                            />
                            <p className="text-[10px] text-muted-foreground font-medium ml-1">Opcional. Se preenchido, o badge do BdP será clicável.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credit_title" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Título da Página de Crédito</Label>
                            <Input
                                id="credit_title"
                                className="h-12 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                value={getValue('credit_title')}
                                onChange={(e) => {
                                    handleChange('credit_title', e.target.value)
                                    if (!settings['credit_title']?.type) setSettings(p => ({ ...p, credit_title: { ...p.credit_title, type: 'text', group_name: 'credit' } }))
                                }}
                                placeholder="INTERMEDIÁRIO DE CRÉDITO VINCULADO"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Apresentação dos Serviços de Crédito</Label>
                            <div className="rounded-xl border border-border overflow-hidden shadow-sm bg-background">
                                <RichTextEditor
                                    content={getValue('credit_text') || "<p>Serviços de Intermediação de Crédito Vinculado.</p>"}
                                    onChange={(v) => {
                                        handleChange('credit_text', v)
                                        if (!settings['credit_text']?.type) setSettings(p => ({ ...p, credit_text: { ...p.credit_text, type: 'richtext', group_name: 'credit' } }))
                                    }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium ml-1">Introdução geral sobre o serviço de crédito em lado esquerdo.</p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border mt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-brand-primary/20 rounded-full" />
                                <h3 className="font-bold text-foreground uppercase tracking-widest text-sm">
                                    Vantagens & Características
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="credit_features_title" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Título da Caixa de Vantagens</Label>
                                <Input
                                    id="credit_features_title"
                                    className="h-12 rounded-xl border-border focus-visible:ring-brand-primary font-bold text-foreground bg-background"
                                    value={getValue('credit_features_title')}
                                    onChange={(e) => {
                                        handleChange('credit_features_title', e.target.value)
                                        if (!settings['credit_features_title']?.type) setSettings(p => ({ ...p, credit_features_title: { ...p.credit_features_title, type: 'text', group_name: 'credit' } }))
                                    }}
                                    placeholder="Ex: Transparência e Rigor"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Texto de Descrição das Vantagens</Label>
                                <div className="rounded-xl border border-border overflow-hidden shadow-sm bg-background">
                                    <RichTextEditor
                                        content={getValue('credit_features_text')}
                                        onChange={(v) => {
                                            handleChange('credit_features_text', v)
                                            if (!settings['credit_features_text']?.type) setSettings(p => ({ ...p, credit_features_text: { ...p.credit_features_text, type: 'richtext', group_name: 'credit' } }))
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium ml-1">Substitui a lista antiga de vantagens. Escreva aqui o que o seu serviço oferece.</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- SOCIAL TAB --- */}
                <TabsContent value="social" className="space-y-8 mt-0">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="social_whatsapp" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Número WhatsApp</Label>
                            <Input
                                id="social_whatsapp"
                                className="h-12 rounded-xl border-emerald-500/20 focus-visible:ring-emerald-500 font-bold text-emerald-500 bg-emerald-500/10"
                                value={getValue('social_whatsapp')}
                                onChange={(e) => handleChange('social_whatsapp', e.target.value)}
                                placeholder="Ex: 351912345678 (Apenas números)"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium ml-1">Usado para o botão de apoio rápido do site.</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
