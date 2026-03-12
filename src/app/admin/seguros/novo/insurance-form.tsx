"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, Trash2, GripVertical, AlertCircle, UploadCloud, ImageIcon, Save, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

// Schema for individual form fields
const formFieldSchema = z.object({
    id: z.string(),
    type: z.enum(["text", "email", "tel", "number", "select", "date", "checkbox"]),
    label: z.string(),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
})

const insuranceSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
    short_description: z.string().min(10, "Descrição curta é obrigatória e importante para os cards."),
    full_description: z.string().min(10, "A descrição detalhada é obrigatória."),
    icon_name: z.string().optional(),
    icon_url: z.string().optional(),
    cover_image_url: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    display_order: z.number().min(0),
    form_fields: z.array(formFieldSchema),
    benefits: z.array(z.object({ value: z.string() })).or(z.array(z.string())),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
})

type InsuranceFormValues = z.infer<typeof insuranceSchema>

export function InsuranceForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [coverFile, setCoverFile] = React.useState<File | null>(null)
    const [coverPreview, setCoverPreview] = React.useState<string | null>(initialData?.cover_image_url || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop")
    const [iconFile, setIconFile] = React.useState<File | null>(null)
    const [iconPreview, setIconPreview] = React.useState<string | null>(initialData?.icon_url || null)

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<InsuranceFormValues>({
        resolver: zodResolver(insuranceSchema),
        defaultValues: {
            name: initialData?.name || "",
            short_description: initialData?.short_description || "",
            full_description: initialData?.full_description || "",
            icon_name: initialData?.icon_name || "",
            icon_url: initialData?.icon_url || "",
            cover_image_url: initialData?.cover_image_url || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
            status: initialData?.status || "active",
            display_order: initialData?.display_order || 0,
            form_fields: (() => {
                const existingFields = initialData?.form_fields || [];
                const systemFields = [
                    { id: "nome", type: "text", label: "O seu Nome", required: true },
                    { id: "email", type: "email", label: "O seu Email", required: true },
                    { id: "telefone", type: "tel", label: "O seu Contacto Telefónico", required: true }
                ] as any[];

                // Se houver campos, vamos certificar-nos de que os obrigatórios estão lá
                if (existingFields.length > 0) {
                    const mergedFields = [...existingFields];
                    // Percorrer de trás para a frente para manter a ordem nome -> email -> telefone no topo caso faltem
                    [...systemFields].reverse().forEach(sf => {
                        if (!mergedFields.find((f: any) => f.id === sf.id)) {
                            // Adiciona ao topo
                            mergedFields.unshift(sf);
                        }
                    });
                    return mergedFields;
                }

                return systemFields;
            })(),
            benefits: initialData?.benefits?.map((b: any) => typeof b === 'string' ? { value: b } : b) || [],
            faqs: initialData?.faqs || []
        },
    })

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "form_fields",
    })

    const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
        control,
        name: "benefits" as never, // z.array(z.string()) doesn't play well with useFieldArray which expects objects
    })

    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
        control,
        name: "faqs",
    })

    const generateSlug = (name: string) => {
        return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    }

    async function onSubmit(data: InsuranceFormValues) {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const isCreate = !initialData?.id

            let cover_image_url = data.cover_image_url
            let icon_url = data.icon_url

            // 1. Upload Cover Image if new file selected
            if (coverFile) {
                const fileExt = coverFile.name.split('.').pop()
                const fileName = `cover-${Date.now()}.${fileExt}`
                const filePath = `insurances/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('insurance-images')
                    .upload(filePath, coverFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('insurance-images')
                    .getPublicUrl(filePath)

                cover_image_url = publicUrl
            }

            // 2. Upload Icon if new file selected
            if (iconFile) {
                const fileExt = iconFile.name.split('.').pop()
                const fileName = `icon-${Date.now()}.${fileExt}`
                const filePath = `insurances/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('insurance-images')
                    .upload(filePath, iconFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('insurance-images')
                    .getPublicUrl(filePath)

                icon_url = publicUrl
            }

            // Extract benefits from array of objects to array of strings if using useFieldArray hack
            const processedBenefits = data.benefits?.map((b: any) => typeof b === 'string' ? b : b.value).filter(Boolean) || []

            const finalData = {
                ...data,
                slug: isCreate ? generateSlug(data.name) + '-' + Math.random().toString(36).substring(2, 6) : initialData.slug,
                cover_image_url,
                icon_url,
                benefits: processedBenefits,
                updated_at: new Date().toISOString()
            }

            let result;

            if (isCreate) {
                result = await supabase.from("insurances").insert(finalData)
            } else {
                result = await supabase.from("insurances").update(finalData).eq("id", initialData.id)
            }

            if (result.error) throw result.error

            router.push("/admin/seguros")
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Ocorreu um erro ao guardar configuração de seguro.")
            setIsLoading(false)
        }
    }

    const addFieldOptions = (index: number, optionsString: string) => {
        // Helper to parse comma separated string into options array
        const optionsArray = optionsString.split(',').map(s => s.trim()).filter(Boolean)
        return optionsArray
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex items-center gap-3 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold uppercase tracking-tight">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="grid gap-12 md:grid-cols-2">
                {/* Coluna 1: Informações Gerais */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div className="h-6 w-1 bg-brand-primary rounded-full" />
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Informação Geral</h3>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Nome do Seguro *</Label>
                            <Input id="name" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary font-bold text-zinc-900 dark:text-zinc-100" placeholder="Ex: Seguro Automóvel" {...register("name")} />
                            {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="short_description" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Breve Descrição (Cards) *</Label>
                            <Textarea
                                id="short_description"
                                className="h-24 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed"
                                placeholder="Ex: A proteção ideal para viagens sempre seguras."
                                {...register("short_description")}
                            />
                            {errors.short_description && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.short_description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Descrição Detalhada *</Label>
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/50">
                                <Controller
                                    name="full_description"
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor content={field.value || ''} onChange={field.onChange} />
                                    )}
                                />
                            </div>
                            {errors.full_description && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.full_description.message}</p>}
                        </div>

                        <div className="grid gap-4 grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Visibilidade</Label>
                                <select
                                    id="status"
                                    className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                                    {...register("status")}
                                >
                                    <option value="active">🟢 Ativo</option>
                                    <option value="inactive">⚪ Inativo</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_order" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Ordem Layout</Label>
                                <Input id="display_order" type="number" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary font-bold text-zinc-900 dark:text-zinc-100" {...register("display_order", { valueAsNumber: true })} />
                                {errors.display_order && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.display_order.message}</p>}
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-1 bg-brand-primary rounded-full" />
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Vantagens e Coberturas</h3>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => appendBenefit({ value: "" } as never)}
                                    className="rounded-lg h-8 px-3 font-bold text-[10px] uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Adicionar Vantagem
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {benefitFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <Input
                                            {...register(`benefits.${index}.value` as never)}
                                            defaultValue={(field as any).value || field}
                                            className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-brand-primary font-medium text-zinc-900 dark:text-zinc-100 flex-1 bg-white dark:bg-zinc-900"
                                            placeholder="Ex: Assistência 24/7 Personalizada"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeBenefit(index)}
                                            className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-10 w-10 shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {benefitFields.length === 0 && (
                                    <p className="text-xs text-zinc-500 italic">Nenhuma vantagem adicionada.</p>
                                )}
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-1 bg-brand-primary rounded-full" />
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Perguntas Frequentes</h3>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => appendFaq({ q: "", a: "" })}
                                    className="rounded-lg h-8 px-3 font-bold text-[10px] uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Adicionar FAQ
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {faqFields.map((field, index) => (
                                    <div key={field.id} className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-3 relative group">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFaq(index)}
                                            className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="space-y-1.5 pr-8">
                                            <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Pergunta</Label>
                                            <Input
                                                {...register(`faqs.${index}.q`)}
                                                className="h-10 text-sm font-bold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-lg border-zinc-200 dark:border-zinc-700"
                                                placeholder="Ex: Quanto tempo demora a emissão?"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Resposta</Label>
                                            <Textarea
                                                {...register(`faqs.${index}.a`)}
                                                className="h-20 text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg border-zinc-200 dark:border-zinc-700 resize-none"
                                                placeholder="Ex: Regra geral é concluída em menos de 24 horas."
                                            />
                                        </div>
                                    </div>
                                ))}
                                {faqFields.length === 0 && (
                                    <p className="text-xs text-zinc-500 italic">Nenhuma pergunta adicionada.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-6 w-1 bg-brand-primary rounded-full" />
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Identidade Visual</h3>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Cover Image Upload */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Imagem de Capa</Label>
                                    <div
                                        onClick={() => document.getElementById('cover-upload')?.click()}
                                        className="aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all relative overflow-hidden group shadow-inner"
                                    >
                                        {coverPreview ? (
                                            <>
                                                <img src={coverPreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <UploadCloud className="text-white h-8 w-8" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 rounded-full bg-white dark:bg-zinc-700 shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                    <ImageIcon className="h-6 w-6 text-zinc-400" />
                                                </div>
                                                <span className="text-[10px] text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest">Carregar Capa</span>
                                                <span className="text-[9px] text-zinc-400 font-medium mt-1">Formatos: JPG, PNG, WEBP (Máx 5MB)</span>
                                            </>
                                        )}
                                        <input
                                            id="cover-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setCoverFile(file)
                                                    setCoverPreview(URL.createObjectURL(file))
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Icon Upload */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Logótipo / Ícone</Label>
                                    <div
                                        onClick={() => document.getElementById('icon-upload')?.click()}
                                        className="aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all relative overflow-hidden group shadow-inner"
                                    >
                                        {iconPreview ? (
                                            <>
                                                <img src={iconPreview} alt="Icon Preview" className="w-16 h-16 object-contain transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <UploadCloud className="text-white h-8 w-8" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 rounded-full bg-white dark:bg-zinc-700 shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                    <Plus className="h-6 w-6 text-zinc-400" />
                                                </div>
                                                <span className="text-[10px] text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest">Carregar Ícone</span>
                                                <span className="text-[9px] text-zinc-400 font-medium mt-1">Formatos: SVG, PNG transparente (Máx 1MB)</span>
                                            </>
                                        )}
                                        <input
                                            id="icon-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setIconFile(file)
                                                    setIconPreview(URL.createObjectURL(file))
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Form Builder */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-brand-primary rounded-full" />
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Construtor de Formulário</h3>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => append({ id: `campo_${fields.length + 1}`, type: "text", label: "Novo Campo", required: false })}
                                className="rounded-lg h-9 px-4 font-bold text-[10px] uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Campo
                            </Button>
                        </div>

                        <p className="text-sm text-text-muted">
                            Configure os campos que o cliente deverá preencher para pedir uma simulação deste seguro específico.
                        </p>

                        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-zinc-200">
                            {fields.map((field, index) => {
                                const fieldType = watch(`form_fields.${index}.type`);
                                const fieldInternalId = watch(`form_fields.${index}.id`);
                                // Identify system-locked fields using the watch value instead of field.id to avoid RHF conflicts
                                const isSystemField = ["nome", "email", "telefone"].includes(fieldInternalId || "");

                                return (
                                    <div key={field.id} className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-brand-primary transition-all group/card">
                                        <div className={`absolute left-3 top-6 transition-colors ${isSystemField ? 'text-zinc-200 dark:text-zinc-800 cursor-not-allowed' : 'text-zinc-300 dark:text-zinc-700 hover:text-brand-primary cursor-move'}`}>
                                            <GripVertical className="h-5 w-5" />
                                        </div>

                                        <div className="absolute right-3 top-3">
                                            {!isSystemField && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-lg"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-12 gap-5 pl-6">
                                            <div className="col-span-12 sm:col-span-7 space-y-1.5">
                                                <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">
                                                    ID Único (Interno) {isSystemField && "(Bloqueado)"}
                                                </Label>
                                                <Input
                                                    {...register(`form_fields.${index}.id`)}
                                                    className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 border-none rounded-lg focus-visible:ring-brand-primary disabled:opacity-75 disabled:text-zinc-400 dark:disabled:text-zinc-600 dark:text-zinc-300"
                                                    placeholder="ex: matricula_carro"
                                                    disabled={isSystemField}
                                                />
                                            </div>

                                            <div className="col-span-12 sm:col-span-5 space-y-1.5">
                                                <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Tipo de Campo</Label>
                                                <select
                                                    className="flex h-9 w-full rounded-lg border-none bg-zinc-50 dark:bg-zinc-950 px-3 py-1 text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-75 disabled:text-zinc-400 dark:disabled:text-zinc-600"
                                                    {...register(`form_fields.${index}.type`)}
                                                    disabled={isSystemField}
                                                >
                                                    <option value="text">Texto Simples</option>
                                                    <option value="email">E-mail</option>
                                                    <option value="tel">Telefone</option>
                                                    <option value="number">Número</option>
                                                    <option value="select">Lista de Opções</option>
                                                    <option value="date">Data</option>
                                                    <option value="checkbox">Seleção (Sim/Não)</option>
                                                </select>
                                            </div>

                                            <div className="col-span-12 space-y-1.5">
                                                <Label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Título visível para o cliente</Label>
                                                <Input
                                                    {...register(`form_fields.${index}.label`)}
                                                    className="h-10 text-sm font-bold text-zinc-800 dark:text-zinc-100 rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                                    placeholder="Ex: Matrícula do Veículo"
                                                />
                                            </div>

                                            {fieldType === "select" && (
                                                <div className="col-span-12 space-y-1.5 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                                    <Label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest px-1">Opções da Lista (Separadas por vírgula)</Label>
                                                    <Controller
                                                        name={`form_fields.${index}.options`}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <Input
                                                                value={value?.join(', ') || ''}
                                                                onChange={(e) => onChange(addFieldOptions(index, e.target.value))}
                                                                className="h-9 text-xs font-medium bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500 rounded-lg dark:text-zinc-100"
                                                                placeholder="Ex: Opção 1, Opção 2, Opção 3"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            )}

                                            <div className="col-span-12 flex items-center space-x-3 pt-4 border-t border-zinc-50 dark:border-zinc-800">
                                                {isSystemField ? (
                                                    <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        id={`required_${index}`}
                                                        className="h-4 w-4 rounded-md border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                                                        {...register(`form_fields.${index}.required`)}
                                                    />
                                                )}
                                                <Label htmlFor={`required_${index}`} className={`text-xs font-bold uppercase tracking-wider ${isSystemField ? 'text-brand-primary' : 'text-zinc-500 dark:text-zinc-400 cursor-pointer'}`}>
                                                    {isSystemField ? "Preenchimento Obrigatório do Sistema" : "Preenchimento Obrigatório"}
                                                </Label>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}

                            {fields.length === 0 && (
                                <div
                                    onClick={() => append({ id: `campo_${fields.length + 1}`, type: "text", label: "Novo Campo", required: false })}
                                    className="p-10 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all bg-zinc-50/30 dark:bg-zinc-800/20"
                                >
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Nenhum campo personalizado</p>
                                    <p className="text-[10px] text-zinc-400 mt-2">Clique aqui para começar a construir o seu formulário.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <Button disabled={isLoading} type="submit" className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl h-12 px-10 font-bold uppercase tracking-widest text-xs shadow-xl">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Configurações do Seguro
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isLoading} className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-zinc-600 dark:hover:text-zinc-300">
                    Descartar & Voltar
                </Button>
            </div>
        </form >
    )
}
