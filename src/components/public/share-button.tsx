"use client"

import * as React from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
    title: string
    text: string
    url: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
    const [copied, setCopied] = React.useState(false)

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (err) {
                console.error("Error copying to clipboard:", err)
            }
        }
    }

    return (
        <Button
            onClick={handleShare}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 h-16 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
        >
            {copied ? (
                <>
                    <Check className="h-5 w-5 text-status-success" /> Link Copiado!
                </>
            ) : (
                <>
                    <Share2 className="h-5 w-5" /> Partilhar Imóvel
                </>
            )}
        </Button>
    )
}
