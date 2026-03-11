import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Termos e Condições | Rui Figueira & Roque",
    description: "Termos de utilização do website Rui Figueira & Roque.",
}

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-brand-dark dark:text-brand-light">Termos e Condições</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-zinc-700 dark:text-zinc-300">
                <p>
                    Ao utilizar este website, concorda com os presentes termos e condições de utilização.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mt-8 mb-4">1. Informação de Imóveis</h2>
                    <p>
                        As informações sobre imóveis são meramente indicativas e não constituem uma proposta contratual. Devem ser confirmadas junto dos nossos consultores.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mt-8 mb-4">2. Mediação de Seguros</h2>
                    <p>
                        A Rui Figueira & Roque, Lda. atua como mediador de seguros registado junto da ASF. As simulações dependem da aprovação das respetivas seguradoras.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mt-8 mb-4">3. Intermediação de Crédito</h2>
                    <p>
                        Somos intermediários de crédito vinculados, registados no Banco de Portugal. Não cobramos qualquer valor aos clientes pela prestação destes serviços.
                    </p>
                </section>
            </div>
        </div>
    )
}
