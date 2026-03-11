"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Loader2, UploadCloud, X, LayoutGrid, Plus, Trash2, AlertCircle, Save, Search, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { createClient } from "@/lib/supabase/client"
import { DISTRICTS, TYPOLOGIES, ENERGY_CERTIFICATES, PROPERTY_TAGS } from "@/lib/types/database"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableImage } from "@/components/admin/sortable-image"

const propertySchema = z.object({
    title: z.string().min(3, "Título deve ter pelo menos 3 caracteres.").max(120),
    description: z.string().min(10, "A descrição é obrigatória."),
    price: z.coerce.number().min(1, "Preço obrigatório"),
    business_type: z.enum(["sale", "rent"]),
    property_type: z.enum(["apartment", "house", "land", "commercial", "other"]),
    typology: z.string().min(1, "Tipologia obrigatória"),
    area_m2: z.coerce.number().min(1, "Área obrigatória"),
    bedrooms: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    energy_certificate: z.string().min(1, "Certificado obrigatório"),
    district: z.string().min(1, "Distrito obrigatório"),
    municipality: z.string().min(1, "Concelho obrigatório"),
    parish: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(["active", "suspended", "draft"]),
    featured: z.boolean().default(false),
    features: z.array(z.string()).default([]),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),
})

type FormData = z.infer<typeof propertySchema>

const MapPicker = dynamic(() => import("@/components/admin/map-picker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-50 animate-pulse rounded-xl border border-zinc-200" />
})

export function PropertyForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Imagens temporárias para preview e upload
    const [images, setImages] = React.useState<{ id?: string, file?: File, preview: string }[]>(
        initialData?.property_images?.map((img: any) => ({
            id: img.id,
            preview: img.url
        })) || []
    )
    const [deletedImageIds, setDeletedImageIds] = React.useState<string[]>([])
    const [isGeocoding, setIsGeocoding] = React.useState(false)
    const [geocodeError, setGeocodeError] = React.useState<string | null>(null)

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            business_type: initialData?.business_type || "sale",
            property_type: initialData?.property_type || "apartment",
            typology: initialData?.typology || "",
            area_m2: initialData?.area_m2 || 0,
            bedrooms: initialData?.bedrooms || 0,
            bathrooms: initialData?.bathrooms || 0,
            energy_certificate: initialData?.energy_certificate || "",
            district: initialData?.district || "Lisboa",
            municipality: initialData?.municipality || "",
            parish: initialData?.parish || "",
            address: initialData?.address || "",
            latitude: initialData?.latitude || null,
            longitude: initialData?.longitude || null,
            status: initialData?.status || "draft",
            featured: initialData?.featured || false,
            features: initialData?.features || [],
        },
    })

    const {
        fields: featureFields,
        append: appendFeature,
        remove: removeFeature,
    } = useFieldArray({
        control,
        name: "features" as any,
    })

    const propertyType = watch("property_type")
    const isResidential = propertyType === "apartment" || propertyType === "house"

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
            setImages(prev => [...prev, ...newImages])
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((img, idx) => `img-${idx}-${img.id || img.preview}` === active.id)
                const newIndex = items.findIndex((img, idx) => `img-${idx}-${img.id || img.preview}` === over.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const removeImage = (index: number) => {
        const img = images[index]
        if (img.id) {
            setDeletedImageIds(prev => [...prev, img.id!])
        }
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    // Gera slug a partir do título
    const generateSlug = (title: string) => {
        return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    }

    const searchLocation = async () => {
        const address = watch("address")
        const municipality = watch("municipality")
        const district = watch("district")
        const parish = watch("parish")

        if (!municipality || !district) {
            setGeocodeError("Por favor, preencha pelo menos o concelho e distrito.")
            return
        }

        setIsGeocoding(true)
        setGeocodeError(null)

        // Crie uma lista de tentativas de pesquisa, da mais específica para a mais geral
        const queriesToTry = [
            [address, parish, municipality, district, "Portugal"].filter(Boolean).join(", "),
            [parish, municipality, district, "Portugal"].filter(Boolean).join(", "),
            [municipality, district, "Portugal"].filter(Boolean).join(", "),
            [district, "Portugal"].filter(Boolean).join(", ")
        ]

        try {
            let foundLocation = false;

            for (const query of queriesToTry) {
                if (!query || query.split(",").length <= 2) continue; // Evita pesquisas vazias ou apenas "Distrito, Portugal"

                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
                const data = await response.json()

                if (data && data.length > 0) {
                    setValue("latitude", parseFloat(data[0].lat))
                    setValue("longitude", parseFloat(data[0].lon))
                    foundLocation = true;
                    break; // Sucesso, para de procurar
                }
            }

            if (!foundLocation) {
                setGeocodeError("Localização não encontrada. Por favor, marque manualmente no mapa indicando a área correta.")
            }
        } catch (err) {
            setGeocodeError("Erro de ligação ao servidor de mapas. Tente novamente mais tarde.")
        } finally {
            setIsGeocoding(false)
        }
    }

    async function onSubmit(data: any) {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const isUpdate = !!initialData?.id
            const slug = isUpdate ? initialData.slug : (generateSlug(data.title) + '-' + Math.random().toString(36).substring(2, 6))

            let propertyId = initialData?.id

            // 1. Inserir ou Atualizar Imóvel
            if (isUpdate) {
                const { error: propertyError } = await supabase
                    .from("properties")
                    .update({
                        ...data,
                        tags: data.featured ? ["Destaque"] : []
                    })
                    .eq("id", propertyId)

                if (propertyError) throw propertyError
            } else {
                const { data: property, error: propertyError } = await supabase
                    .from("properties")
                    .insert({
                        ...data,
                        slug,
                        tags: data.featured ? ["Destaque"] : []
                    })
                    .select("id")
                    .single()

                if (propertyError) throw propertyError
                propertyId = property.id
            }

            // 2. Tratar Deleções (se houver)
            if (deletedImageIds.length > 0) {
                await supabase
                    .from("property_images")
                    .delete()
                    .in("id", deletedImageIds)
            }

            // 3. Upload de Novas Imagens e Reordenação
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const img = images[i]

                    if (img.file) {
                        // Novo upload
                        const fileExt = img.file.name.split('.').pop()
                        const fileName = `${propertyId}/${Date.now()}-${i}.${fileExt}`

                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('property-images')
                            .upload(fileName, img.file)

                        if (!uploadError && uploadData) {
                            const { data: { publicUrl } } = supabase.storage
                                .from('property-images')
                                .getPublicUrl(fileName)

                            await supabase.from("property_images").insert({
                                property_id: propertyId,
                                url: publicUrl,
                                display_order: i
                            })
                        }
                    } else if (img.id) {
                        // Apenas atualizar ordem da imagem existente
                        await supabase
                            .from("property_images")
                            .update({ display_order: i })
                            .eq("id", img.id)
                    }
                }
            }

            router.push("/admin/imoveis")
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Ocorreu um erro ao guardar o imóvel.")
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex items-center gap-3 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold uppercase tracking-tight">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Secção: Informação Principal */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="h-6 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Informação Principal</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="title" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Título do Imóvel *</Label>
                        <Input id="title" className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" placeholder="Ex: Moradia T3 com Piscina em Cascais" {...register("title")} />
                        {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{String(errors.title.message)}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Descrição Detalhada *</Label>
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-zinc-900/50">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor content={field.value || ''} onChange={field.onChange} />
                                )}
                            />
                        </div>
                        {errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{String(errors.description.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Preço (€) *</Label>
                        <Input id="price" type="number" step="0.01" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" {...register("price")} />
                        {errors.price && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{String(errors.price.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="business_type" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Tipo de Negócio *</Label>
                        <select
                            id="business_type"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                            {...register("business_type")}
                        >
                            <option value="sale">Venda</option>
                            <option value="rent">Arrendamento</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Secção: Características */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="h-6 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Características Gerais</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="property_type" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Tipo de Imóvel *</Label>
                        <select
                            id="property_type"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                            {...register("property_type")}
                        >
                            <option value="apartment">Apartamento</option>
                            <option value="house">Moradia</option>
                            <option value="land">Terreno</option>
                            <option value="commercial">Espaço Comercial</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="typology" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Tipologia *</Label>
                        <select
                            id="typology"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                            {...register("typology")}
                        >
                            {TYPOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="area_m2" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Área Bruta (m²) *</Label>
                        <Input id="area_m2" type="number" step="0.01" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" {...register("area_m2")} />
                        {errors.area_m2 && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{String(errors.area_m2.message)}</p>}
                    </div>

                    {isResidential && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="bedrooms" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Quartos</Label>
                                <Input id="bedrooms" type="number" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" {...register("bedrooms")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bathrooms" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Casas de Banho</Label>
                                <Input id="bathrooms" type="number" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" {...register("bathrooms")} />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="energy_certificate" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Certificado Energético *</Label>
                        <select
                            id="energy_certificate"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                            {...register("energy_certificate")}
                        >
                            {ENERGY_CERTIFICATES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Secção: Localização */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="h-6 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Localização</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="district" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Distrito *</Label>
                        <select
                            id="district"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                            {...register("district")}
                        >
                            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="municipality" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Concelho *</Label>
                        <Input id="municipality" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" {...register("municipality")} />
                        {errors.municipality && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{String(errors.municipality.message)}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Morada Completa (Não pública na íntegra)</Label>
                        <Input id="address" className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 font-bold text-zinc-900 dark:text-zinc-100" {...register("address")} />
                    </div>

                    <div className="space-y-4 md:col-span-2 mt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 block">Localização no Mapa (Aprox.)</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={searchLocation}
                                disabled={isGeocoding}
                                className="h-8 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700"
                            >
                                {isGeocoding ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Search className="h-3.5 w-3.5 mr-2" />}
                                Procurar Morada
                            </Button>
                        </div>

                        {geocodeError && (
                            <div className="p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-xs mt-2">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>{geocodeError}</p>
                            </div>
                        )}

                        <Controller
                            name="latitude"
                            control={control}
                            render={({ field: latField }) => (
                                <Controller
                                    name="longitude"
                                    control={control}
                                    render={({ field: lngField }) => (
                                        <MapPicker
                                            lat={latField.value}
                                            lng={lngField.value}
                                            onChange={(lat, lng) => {
                                                setValue("latitude", lat)
                                                setValue("longitude", lng)
                                                setGeocodeError(null)
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                <div className="flex-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-0.5">Latitude</span>
                                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 font-bold">{watch("latitude") ? Number(watch("latitude")).toFixed(6) : "---"}</span>
                                </div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                <div className="flex-1">
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-0.5">Longitude</span>
                                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 font-bold">{watch("longitude") ? Number(watch("longitude")).toFixed(6) : "---"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secção: Características Detalhadas */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Extras & Detalhes</h3>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => appendFeature("")}
                        className="rounded-lg h-9 px-4 font-bold text-[10px] uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    >
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Novo Extra
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {featureFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-3 group bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-600">
                            <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs shrink-0">
                                {index + 1}
                            </div>
                            <Input
                                {...register(`features.${index}` as any)}
                                placeholder="Ex: Cozinha Equipada, Ar Condicionado..."
                                className="flex-1 border-none bg-transparent focus-visible:ring-0 font-medium text-zinc-800 dark:text-zinc-200 h-9"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index)}
                                className="text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg h-8 w-8 shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {featureFields.length === 0 && (
                        <div
                            onClick={() => appendFeature("")}
                            className="text-xs text-zinc-400 font-bold uppercase tracking-widest col-span-2 py-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                        >
                            Clique aqui para adicionar características
                        </div>
                    )}
                </div>
            </div>

            {/* Secção: Imagens */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="h-6 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Galeria Fotográfica</h3>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl cursor-pointer bg-zinc-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-inner group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="p-3 rounded-full bg-white dark:bg-zinc-700 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-6 h-6 text-zinc-400" />
                                </div>
                                <p className="mb-1 text-sm text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-wider">Arraste fotos ou clique para carregar</p>
                                <p className="text-[10px] text-zinc-400 font-medium">Formatos aceites: JPG, PNG, WebP (Máx. 5MB por ficheiro)</p>
                            </div>
                            <input id="images" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    {images.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={images.map((img, idx) => `img-${idx}-${img.id || img.preview}`)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                                    {images.map((img, index) => (
                                        <SortableImage
                                            key={`img-${index}-${img.id || img.preview}`}
                                            id={`img-${index}-${img.id || img.preview}`}
                                            index={index}
                                            preview={img.preview}
                                            onRemove={removeImage}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>

            {/* Secção: Publicação */}
            <div className="space-y-6 mt-12 bg-zinc-50/50 dark:bg-zinc-800/30 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                    <div className="h-6 w-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Visibilidade & Destaques</h3>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Estado de Publicação *</Label>
                        <select
                            id="status"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                            {...register("status")}
                        >
                            <option value="active">🟢 Ativo (Público no Site)</option>
                            <option value="suspended">🟡 Suspenso (Invisível no Site)</option>
                            <option value="draft">⚪ Rascunho (Gestão Interna)</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-3 pt-6">
                        <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-3 w-full cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                            <Controller
                                name="featured"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        className="h-5 w-5 rounded-lg border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                )}
                            />
                            <Label htmlFor="featured" className="cursor-pointer font-bold text-zinc-700 dark:text-zinc-300 text-sm">Destacar Imóvel na Homepage</Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <Button disabled={isLoading} type="submit" className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl h-12 px-10 font-bold uppercase tracking-widest text-xs shadow-xl">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Alterações do Imóvel
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isLoading} className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] hover:text-zinc-600">
                    Descartar & Voltar
                </Button>
            </div>
        </form>
    )
}
