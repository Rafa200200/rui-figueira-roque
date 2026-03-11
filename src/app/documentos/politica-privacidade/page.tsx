import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Política de Privacidade | Rui Figueira & Roque",
    description: "Saiba como tratamos os seus dados pessoais.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-brand-dark dark:text-brand-light">Política de Privacidade</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-zinc-700 dark:text-zinc-300">
                <p>
                    A Rui Figueira & Roque, Lda. está empenhada em proteger a privacidade e os dados pessoais dos seus clientes e utilizadores do website.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mt-8 mb-4">1. Recolha de Dados</h2>
                    <p>
                        Recolhemos dados através dos formulários de contacto, pedidos de visita a imóveis e simulações de seguros. Os dados recolhidos incluem nome, email e telefone.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mt-8 mb-4">2. Finalidade do Tratamento</h2>
                    <p>
                        Os dados destinam-se exclusivamente ao processamento dos pedidos efetuados pelo utilizador e para contacto comercial relacionado com os serviços da empresa (Imobiliária, Seguros e Crédito).
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-brand-light mt-8 mb-4">3. Direitos do Utilizador</h2>
                    <p>
                        O utilizador tem o direito de aceder, retificar ou eliminar os seus dados a qualquer momento, bastando para tal contactar-nos através dos meios oficiais fornecidos no website.
                    </p>
                </section>
            </div>
        </div>
    )
}
