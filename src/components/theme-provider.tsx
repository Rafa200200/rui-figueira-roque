"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { usePathname } from "next/navigation"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/login")

    return (
        <NextThemesProvider
            {...props}
            forcedTheme={!isAdminRoute ? "light" : undefined}
        >
            {children}
        </NextThemesProvider>
    )
}
