"use client"

import * as React from "react"
import Image from "next/image"
import {
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Camera
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog"

interface PropertyGalleryProps {
    images: { url: string; alt_text?: string }[];
    title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [currentIndex, setCurrentIndex] = React.useState(0)

    const mainImage = images[0]?.url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight") nextImage()
        if (e.key === "ArrowLeft") prevImage()
        if (e.key === "Escape") setIsOpen(false)
    }

    const openAt = (index: number) => {
        setCurrentIndex(index)
        setIsOpen(true)
    }

    if (!images || images.length === 0) {
        return (
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 aspect-[16/10]">
                <Image src={mainImage} alt={title} fill className="object-cover" priority />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {/* Mobile View: Swipeable Carousel */}
                <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => openAt(i)}
                            className="relative flex-none w-[88vw] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer snap-center group bg-zinc-100 dark:bg-zinc-800"
                        >
                            <Image
                                src={img.url}
                                alt={img.alt_text || `${title} - Foto ${i + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 active:scale-[0.98]"
                                priority={i === 0}
                            />
                            <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors flex items-center justify-center">
                                <Maximize2 className="text-white opacity-0 active:opacity-100 transition-opacity w-10 h-10 drop-shadow-lg" />
                            </div>
                            {images.length > 1 && (
                                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider shadow-lg">
                                    <Camera className="w-3.5 h-3.5" />
                                    {i + 1} / {images.length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop View: Grid Layout */}
                <div className="hidden md:grid grid-cols-4 gap-4 aspect-[16/8]">
                    {/* Main Image */}
                    <div
                        onClick={() => openAt(0)}
                        className="col-span-3 relative rounded-[2rem] overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 cursor-pointer group"
                    >
                        <Image
                            src={mainImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 drop-shadow-lg" />
                        </div>
                    </div>

                    {/* Side Previews */}
                    <div className="flex flex-col gap-4">
                        {images.slice(1, 3).map((img, i) => (
                            <div
                                key={i}
                                onClick={() => openAt(i + 1)}
                                className="relative flex-1 rounded-2xl overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 cursor-pointer group"
                            >
                                <Image
                                    src={img.url}
                                    alt={img.alt_text || ""}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                        ))}

                        {images.length > 3 && (
                            <div
                                onClick={() => openAt(3)}
                                className="relative flex-1 rounded-2xl overflow-hidden bg-brand-dark flex items-center justify-center cursor-pointer group"
                            >
                                <Image
                                    src={images[3].url}
                                    alt=""
                                    fill
                                    className="object-cover opacity-40 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110"
                                />
                                <div className="relative z-10 text-white text-center">
                                    <span className="block font-black text-2xl">+{images.length - 3}</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest">Ver Galeria</span>
                                </div>
                            </div>
                        )}
                        {images.length === 3 && (
                            <div
                                onClick={() => openAt(0)}
                                className="relative flex-1 rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-400"
                            >
                                <Maximize2 className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                </div>

                <DialogContent className="max-w-[100vw] h-[100vh] w-full p-0 border-none bg-black/95 flex flex-col items-center justify-center z-[100]" onKeyDown={handleKeyDown}>
                    <DialogTitle className="sr-only">Galeria de Imagens - {title}</DialogTitle>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 z-[110] text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-6 z-[110] text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-4 rounded-full backdrop-blur-sm hidden md:block"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-6 z-[110] text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-4 rounded-full backdrop-blur-sm hidden md:block"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    {/* Main Image in Lightbox */}
                    <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-auto select-none px-4 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex].url}
                                alt={images[currentIndex].alt_text || `Slide ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Counter & Controls (Mobile) */}
                    <div className="absolute bottom-10 left-0 right-0 z-[110] flex flex-col items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold tracking-widest text-sm border border-white/10">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Mobile Arrows */}
                        <div className="flex gap-4 md:hidden">
                            <button onClick={prevImage} className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-white">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={nextImage} className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-white">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnails Strip (Optional but nice) */}
                    <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 py-2 hidden md:flex">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === i ? 'border-brand-primary scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                            >
                                <Image src={img.url} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
