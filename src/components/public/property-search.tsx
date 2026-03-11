"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PropertySearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [type, setType] = useState(searchParams.get("type") || "")
    const [propertyType, setPropertyType] = useState(searchParams.get("property_type") || "")
    const [district, setDistrict] = useState(searchParams.get("district") || "")

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (type) params.set("type", type)
        if (propertyType) params.set("property_type", propertyType)
        if (district) params.set("district", district)

        router.push(`/imoveis?${params.toString()}`)
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-5 border border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Negócio</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer text-zinc-900 dark:text-zinc-100"
                    >
                        <option value="">Todos os Tipos</option>
                        <option value="sale">Comprar</option>
                        <option value="rent">Arrendar</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tipo de Imóvel</label>
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer text-zinc-900 dark:text-zinc-100"
                    >
                        <option value="">Qualquer</option>
                        <option value="house">Moradia</option>
                        <option value="apartment">Apartamento</option>
                        <option value="land">Terreno</option>
                        <option value="commercial">Comercial</option>
                        <option value="other">Quinta / Outro</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Localização</label>
                    <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Distrito ou Cidade"
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/20 text-zinc-900 dark:text-zinc-100"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        onClick={handleSearch}
                        className="w-full bg-brand-primary hover:bg-brand-dark text-white font-semibold h-10 rounded-lg shadow-sm transition-all"
                    >
                        <Search className="mr-2 h-4 w-4" /> Pesquisar
                    </Button>
                </div>
            </div>
        </div>
    )
}
