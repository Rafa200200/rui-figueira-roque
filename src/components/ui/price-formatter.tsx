import { cn } from "@/lib/utils"

interface PriceFormatterProps {
    price: number
    businessType?: "sale" | "rent"
    className?: string
    amountClassName?: string
    currencyClassName?: string
}

export function PriceFormatter({
    price,
    businessType,
    className,
    amountClassName,
    currencyClassName,
}: PriceFormatterProps) {
    // Format the number with dots as thousand separators and no decimals
    const formattedAmount = new Intl.NumberFormat("pt-PT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)

    return (
        <div className={cn("flex items-baseline gap-1.5", className)}>
            <span className={cn("font-bold tabular-nums tracking-tight", amountClassName)}>
                {formattedAmount}
            </span>
            <span className={cn("text-[0.65em] font-bold text-zinc-400 uppercase tracking-wider", currencyClassName)}>
                €
            </span>
            {businessType === "rent" && (
                <span className="text-[0.5em] font-medium text-zinc-400 uppercase ml-1 tracking-widest">
                    / mês
                </span>
            )}
        </div>
    )
}
