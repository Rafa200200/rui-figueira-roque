import { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        template: "%s | Backoffice",
        default: "Backoffice | Rui Figueira & Roque Lda",
    },
}

import { Sidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background-alt md:flex-row">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
