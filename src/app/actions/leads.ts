"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitLead(formData: FormData) {
    const supabase = await createClient()

    const type = formData.get("type") as "contact" | "visit_request" | "insurance_simulation" | "credit"
    const propertyId = formData.get("property_id") as string | null
    const insuranceId = formData.get("insurance_id") as string | null

    let name = formData.get("name") as string || ""
    let email = formData.get("email") as string || ""
    let phone = formData.get("phone") as string || ""
    let message = formData.get("message") as string || ""

    const dynamicData: Record<string, string> = {}

    // Extract dynamic fields to include in the message and try to guess core fields 
    formData.forEach((value, key) => {
        // Skip explicitly known standard fields
        if (["type", "property_id", "insurance_id", "name", "email", "phone", "message"].includes(key)) {
            return
        }

        if (typeof value === "string" && value.trim() !== "") {
            const lowerKey = key.toLowerCase()

            // Heuristic detection of core fields for the Leads table columns
            if (!name && (lowerKey.includes("nome") || lowerKey.includes("name") || lowerKey.includes("titular"))) name = value
            if (!email && (lowerKey.includes("email") || lowerKey.includes("e-mail") || lowerKey.includes("mail"))) email = value
            if (!phone && (lowerKey.includes("telefone") || lowerKey.includes("telemovel") || lowerKey.includes("telemóvel") || lowerKey.includes("contacto") || lowerKey.includes("phone"))) phone = value

            dynamicData[key] = value
        }
    })

    if (!name) name = "Utilizador (via Simulador)"
    if (!email && !phone) {
        return { error: "Por favor, preencha pelo menos um campo de contacto ou e-mail/telefone na sua simulação." }
    }

    // Format all additional user inputs into a readable text block
    const formattedMessage = Object.entries(dynamicData)
        .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
        .join("\n")

    // Combine any base message with the dynamic form data
    const finalMessage = [message, formattedMessage].filter(Boolean).join("\n\n--- Detalhes Adicionais ---\n")

    const { error } = await supabase
        .from("leads")
        .insert([
            {
                name,
                email,
                phone,
                message: finalMessage,
                type,
                property_id: propertyId || null,
                insurance_id: insuranceId || null,
                status: "new"
            }
        ])

    if (error) {
        console.error("Error submitting lead:", error)
        return { error: "Erro ao enviar pedido. Por favor tente mais tarde." }
    }

    revalidatePath("/admin/leads")
    return { success: true }
}
