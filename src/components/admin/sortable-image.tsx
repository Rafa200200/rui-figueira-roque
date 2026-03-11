"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { X, GripVertical } from "lucide-react"

interface SortableImageProps {
    id: string
    index: number
    preview: string
    onRemove: (index: number) => void
}

export function SortableImage({ id, index, preview, onRemove }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative aspect-square rounded-md overflow-hidden bg-muted group border border-foreground/10 shadow-sm"
        >
            <img src={preview} alt={`Preview ${index}`} className="object-cover w-full h-full select-none" />

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1.5 rounded-md shadow-sm border border-foreground/10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <GripVertical className="w-4 h-4 text-foreground/60" />
            </div>

            {/* Remove Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                    }}
                    className="bg-status-error text-white p-1.5 rounded-full hover:scale-110 transition-transform pointer-events-auto"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Capa Label */}
            {index === 0 && (
                <div className="absolute top-1 left-1 bg-brand-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow z-10">
                    Capa
                </div>
            )}
        </div>
    )
}
