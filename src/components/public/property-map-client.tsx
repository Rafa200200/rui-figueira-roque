"use client"

import dynamic from "next/dynamic"
import React from "react"

// Importamos o componente real do mapa com ssr: false dentro de um Client Component
const PropertyMapInner = dynamic(() => import("./property-map"), {
    ssr: false,
    loading: () => <div className="h-[350px] w-full bg-zinc-50 dark:bg-zinc-800 animate-pulse rounded-2xl border border-zinc-200 dark:border-zinc-800" />
})

interface PropertyMapClientProps {
    lat: number
    lng: number
    parish?: string
    municipality?: string
}

export function PropertyMapClient(props: PropertyMapClientProps) {
    // Este wrapper é um Client Component, portanto pode usar next/dynamic com ssr: false
    return <PropertyMapInner {...props} />
}
