export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    role: string
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    role?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    role?: string
                    created_at?: string
                }
            }
            properties: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string
                    price: number
                    business_type: string
                    property_type: string
                    typology: string
                    area_m2: number
                    bedrooms: number | null
                    bathrooms: number | null
                    energy_certificate: string
                    district: string
                    municipality: string
                    parish: string | null
                    address: string | null
                    latitude: number | null
                    longitude: number | null
                    tags: string[]
                    status: string
                    featured: boolean
                    display_order: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description: string
                    price: number
                    business_type: string
                    property_type: string
                    typology: string
                    area_m2: number
                    bedrooms?: number | null
                    bathrooms?: number | null
                    energy_certificate: string
                    district: string
                    municipality: string
                    parish?: string | null
                    address?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    tags?: string[]
                    status?: string
                    featured?: boolean
                    display_order?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string
                    price?: number
                    business_type?: string
                    property_type?: string
                    typology?: string
                    area_m2?: number
                    bedrooms?: number | null
                    bathrooms?: number | null
                    energy_certificate?: string
                    district?: string
                    municipality?: string
                    parish?: string | null
                    address?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    tags?: string[]
                    status?: string
                    featured?: boolean
                    display_order?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            property_images: {
                Row: {
                    id: string
                    property_id: string
                    url: string
                    alt_text: string | null
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    property_id: string
                    url: string
                    alt_text?: string | null
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    property_id?: string
                    url?: string
                    alt_text?: string | null
                    display_order?: number
                    created_at?: string
                }
            }
            insurances: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    short_description: string
                    full_description: string
                    icon_name: string | null
                    icon_url: string | null
                    cover_image_url: string | null
                    form_fields: FormField[]
                    status: string
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    short_description: string
                    full_description: string
                    icon_name?: string | null
                    icon_url?: string | null
                    cover_image_url?: string | null
                    form_fields: FormField[]
                    status?: string
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    short_description?: string
                    full_description?: string
                    icon_name?: string | null
                    icon_url?: string | null
                    cover_image_url?: string | null
                    form_fields?: FormField[]
                    status?: string
                    display_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            site_settings: {
                Row: {
                    id: string
                    key: string
                    value: string | null
                    type: string
                    group_name: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value?: string | null
                    type: string
                    group_name: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: string | null
                    type?: string
                    group_name?: string
                    updated_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    type: string
                    name: string
                    email: string
                    phone: string | null
                    message: string | null
                    form_data: Record<string, unknown> | null
                    property_id: string | null
                    insurance_id: string | null
                    status: string
                    internal_notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    type: string
                    name: string
                    email: string
                    phone?: string | null
                    message?: string | null
                    form_data?: Record<string, unknown> | null
                    property_id?: string | null
                    insurance_id?: string | null
                    status?: string
                    internal_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    type?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    message?: string | null
                    form_data?: Record<string, unknown> | null
                    property_id?: string | null
                    insurance_id?: string | null
                    status?: string
                    internal_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

// ---- Helper types ----

export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update']

// Convenience aliases
export type Property = Tables<'properties'>
export type PropertyImage = Tables<'property_images'>
export type Insurance = Tables<'insurances'>
export type SiteSetting = Tables<'site_settings'>
export type Lead = Tables<'leads'>
export type User = Tables<'users'>

// Property with images joined
export type PropertyWithImages = Property & {
    property_images: PropertyImage[]
}

// Lead with relations
export type LeadWithRelations = Lead & {
    properties?: Property | null
    insurances?: Insurance | null
}

// Form field definition for insurance simulation forms
export type FormField = {
    id: string
    type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'email' | 'tel'
    label: string
    placeholder?: string
    required?: boolean
    options?: string[]
    min?: number
    max?: number
    unit?: string
}

// Enums
export const PROPERTY_STATUS = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    DRAFT: 'draft',
} as const

export const BUSINESS_TYPES = {
    SALE: 'sale',
    RENT: 'rent',
} as const

export const PROPERTY_TYPES = {
    APARTMENT: 'apartment',
    HOUSE: 'house',
    LAND: 'land',
    COMMERCIAL: 'commercial',
    OTHER: 'other',
} as const

export const TYPOLOGIES = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'] as const

export const ENERGY_CERTIFICATES = [
    'A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F', 'Isento',
] as const

export const LEAD_TYPES = {
    CONTACT: 'contact',
    VISIT_REQUEST: 'visit_request',
    INSURANCE_SIMULATION: 'insurance_simulation',
} as const

export const LEAD_STATUS = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    CLOSED: 'closed',
} as const

export const INSURANCE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const

// Portuguese districts
export const DISTRICTS = [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco',
    'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria',
    'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal',
    'Viana do Castelo', 'Vila Real', 'Viseu',
    'Ilha da Madeira', 'Ilha de Porto Santo',
    'Ilha de São Miguel', 'Ilha Terceira', 'Ilha do Faial',
    'Ilha do Pico', 'Ilha de São Jorge', 'Ilha Graciosa',
    'Ilha das Flores', 'Ilha do Corvo', 'Ilha de Santa Maria',
] as const

// Property tags
export const PROPERTY_TAGS = [
    'Novo', 'Baixa de Preço', 'Exclusivo', 'Vendido', 'Reservado',
] as const
