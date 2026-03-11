"use client"

import React from "react"
import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface PropertyMapProps {
    lat: number
    lng: number
    parish?: string
    municipality?: string
}

function MapResizer() {
    const map = useMap()
    React.useEffect(() => {
        setTimeout(() => {
            map.invalidateSize()
        }, 100)
    }, [map])
    return null
}

export default function PropertyMap({ lat, lng, parish, municipality }: PropertyMapProps) {
    if (!lat || !lng) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                <div className="h-6 w-1 bg-zinc-900 rounded-full" />
                <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-xs">Localização Aproximada</h3>
            </div>

            <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-zinc-200 shadow-sm z-0 relative">
                <MapContainer
                    center={[lat, lng]}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Circle
                        center={[lat, lng]}
                        radius={500}
                        pathOptions={{
                            color: '#18181b',
                            fillColor: '#18181b',
                            fillOpacity: 0.2,
                            weight: 2
                        }}
                    />
                    <MapResizer />
                </MapContainer>

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg z-[1000] flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zona de Referência</p>
                        <p className="text-sm font-bold text-zinc-900">
                            {parish ? `${parish}, ` : ''}{municipality}
                        </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-medium italic">
                * Por motivos de segurança e privacidade, a localização exata não é revelada. O círculo indica a zona aproximada do imóvel.
            </p>
        </div>
    )
}
