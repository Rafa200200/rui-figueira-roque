"use client"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para ícones do Leaflet que às vezes não carregam no Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapPickerProps {
    lat: number | null
    lng: number | null
    onChange: (lat: number, lng: number) => void
}

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
    const map = useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng)
        },
    })

    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 13)
        }
    }, [lat, lng, map])

    return lat && lng ? (
        <>
            <Marker position={[lat, lng]} />
            <Circle
                center={[lat, lng]}
                radius={500}
                pathOptions={{ color: 'green', fillColor: 'green' }}
            />
        </>
    ) : null
}

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-zinc-200 shadow-sm z-0">
            <MapContainer
                center={[lat || 38.7223, lng || -9.1393]} // Lisboa default
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker lat={lat} lng={lng} onChange={onChange} />
            </MapContainer>
            <div className="bg-zinc-50 p-3 border-t border-zinc-200">
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-center">
                    Clique no mapa para marcar a localização aproximada
                </p>
            </div>
        </div>
    )
}
