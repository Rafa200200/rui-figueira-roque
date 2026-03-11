import { createClient } from '@supabase/supabase-js'

// You must pass the project URL and the service role key to insert records safely from a script.
// Next.js config doesn't run automatically in plain node.
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedProperties() {
    console.log("Starting to seed properties...")

    const properties = [
        {
            title: "Moradia T4 de Luxo com Piscina e Vista Deslumbrante",
            slug: "moradia-t4-luxo-piscina-vista-2",
            description: "Descubra o requinte e a sofisticação nesta magnífica moradia T4 de arquitetura contemporânea. Situada numa zona premium, esta propriedade oferece uma vista panorâmica inigualável. O interior destaca-se pelos seus acabamentos de altíssima qualidade, com piso radiante, domótica avançada e uma Master Suite com walking closet imponente. A zona exterior convida ao lazer com uma piscina de horizonte infinito, zona de barbecue e um jardim paisagístico cuidadosamente desenhado para garantir total privacidade. Uma oportunidade única para quem procura exclusividade e conforto num só lugar.",
            price: 1250000,
            location: "Foz do Douro, Porto",
            bedrooms: 4,
            bathrooms: 5,
            area: 340,
            type: "Moradia",
            status: "Venda",
            features: ["Piscina Infinita", "Domótica", "Vista Mar", "Piso Radiante", "Jardim Privado", "Garagem 4 Carros"],
            is_featured: true,
            energy_certificate: "A+"
        },
        {
            title: "Apartamento T3 Duplex no Coração da Cidade",
            slug: "apartamento-t3-duplex-centro-cidade-2",
            description: "Excecional apartamento T3 Duplex localizado num edifício histórico totalmente reabilitado no centro nevrálgico da cidade. Este imóvel combina o charme da traça original (como o teto trabalhado e portadas de madeira) com as comodidades modernas exigidas atualmente. O primeiro piso conta com uma sala de estar ampla e luminosa com varanda, sala de jantar integrada, e uma cozinha equipada com eletrodomésticos topo de gama. O segundo piso é reservado para a zona íntima com três quartos, sendo dois com varanda privativa. Beneficia ainda de isolamento térmico e acústico de excelência e estacionamento privativo duplo.",
            price: 680000,
            location: "Baixa, Lisboa",
            bedrooms: 3,
            bathrooms: 3,
            area: 185,
            type: "Apartamento",
            status: "Venda",
            features: ["Duplex", "Prédio Reabilitado", "Cozinha Equipada", "Varandas", "Ar Condicionado", "2 Lugares de Garagem"],
            is_featured: true,
            energy_certificate: "B"
        },
        {
            title: "Quinta Centenária Renovada com Terreno Agrícola",
            slug: "quinta-centenaria-renovada-terreno-3",
            description: "Um refúgio de paz e tranquilidade: deslumbrante Quinta Centenária minuciosamente restaurada, preservando a sua autenticidade arquitetónica aliada ao conforto do século XXI. A casa principal dispõe de amplos salões em pedra exposta, lareiras rústicas e uma cozinha regional típica de invejar. Além da habitação principal impressionante, a propriedade abrange 2 hectares de terreno, incluindo uma vinha ativa, pomares exuberantes e uma zona de bosque. Ideal tanto para residência permanente de quem procura qualidade de vida e ligação à natureza, como para investimento em turismo de habitação de luxo.",
            price: 950000,
            location: "Vale do Douro, Peso da Régua",
            bedrooms: 5,
            bathrooms: 4,
            area: 450,
            type: "Quinta",
            status: "Venda",
            features: ["Terreno 2ha", "Vinha", "Adega", "Poço Próprio", "Casa Mães", "Aquecimento Central"],
            is_featured: true,
            energy_certificate: "C"
        }
    ]

    const placeHolderImages = [
        [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
            "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
        ],
        [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1de2d9d06b?w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
            "https://images.unsplash.com/photo-1583847268964-b28ce8fba3d5?w=800&q=80",
            "https://images.unsplash.com/photo-1493809842364-78817add7ff6?w=800&q=80"
        ],
        [
            "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
            "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80",
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
            "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80",
            "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=800&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"
        ]
    ]

    for (let i = 0; i < properties.length; i++) {
        const prop = properties[i]
        console.log(`Inserting ${prop.title}...`)

        const { data: insertedProp, error: propError } = await supabase
            .from('properties')
            .insert(prop)
            .select()
            .single()

        if (propError) {
            console.error(`Error inserting property ${prop.title}:`, propError)
            continue
        }

        const imagesToInsert = placeHolderImages[i].map((url, idx) => ({
            property_id: insertedProp.id,
            image_url: url,
            display_order: idx
        }))

        const { error: imageError } = await supabase
            .from('property_images')
            .insert(imagesToInsert)

        if (imageError) {
            console.error(`Error inserting images for ${prop.title}:`, imageError)
        } else {
            console.log(`Successfully seeded ${prop.title} with ${imagesToInsert.length} images.`)
        }
    }

    console.log("Done.")
}

seedProperties()
