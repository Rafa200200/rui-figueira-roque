# Rui Figueira & Roque Lda - Website de Mediação Imobiliária e Seguros

Este projeto é uma plataforma moderna, profissional e completa desenvolvida para a agência **Rui Figueira & Roque Lda**, especializada na mediação imobiliária, mediação de seguros e aconselhamento em crédito bancário.

A plataforma é composta por um site público virado para o cliente e um backoffice robusto (painel de administração) reservado à gestão de conteúdos, leads comerciais e portefólio.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as mais recentes e modernas tecnologias do ecossistema de desenvolvimento web:

* **Framework Principal:** [Next.js 15+](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para segurança de tipos
* **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) para design responsivo e eficiente
* **Base de Dados & Backend as a Service:** [Supabase](https://supabase.com/) (PostgreSQL avançado com Autenticação, Storage e RLS)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI) para componentes acessíveis e limpos
* **Mapas:** [Leaflet](https://leafletjs.com/) e OpenStreetMap (100% gratuito e sem chaves de API)
* **Gestão de Estado & Formulários:** React Hook Form e Zod para validação
* **Upload & Edição:** Suporte nativo e Drag-and-Drop (`@dnd-kit`) para galerias de imagens
* **Tipografia:** Fontes Inter e Outfit (Google Fonts)

## 🌟 Principais Funcionalidades Implementadas

### 1. Site Público (Front-end)
* **Página Inicial (Homepage):** Design corporativo limpo, focado na confiança. Destaque para os três pilares de negócio: Imobiliária, Seguros e Créditos, sem necessidade de scrolling excessivo (conteúdo *above the fold*).
* **Portefólio de Imóveis:** Listagem detalhada de propriedades, filtragem e sistema avançado de galeria de imagens (lightbox interativa com carrossel tátil para mobile).
* **Oferta de Seguros:** Exposição clara das apólices disponíveis com chamadas de atenção diretas.
* **Mapas com Privacidade:** Visualização circular do raio de localização dos imóveis (sem expor moradas exatas).
* **Captura de Leads:** Formulários de contacto inteligentemente distribuídos e otimizados na recolha de dados dos interessados.

### 2. Backoffice (Gestão de Administração)
* **Gestão de Imóveis (CRUD):** Criação, edição e eliminação de propriedades. Inclui funcionalidade avançada de arrastar-e-largar (drag-and-drop) para a reordenação das galerias de imagens.
* **Geocodificação Automática:** Preenchimento automático da latitude e longitude do imóvel através da morada no OpenStreetMap.
* **Gestão de Seguros:** Ferramenta para criar as várias páginas do serviço de seguros com formatação em Rich Text (editor WYSIWYG) e upload de ícones/imagens.
* **Caixa de Leads (CRM Básico):** Recepção de pedidos de visita a imóveis, orçamentos para seguros ou mensagens genéricas em tempo real. Identificação visual clara da sua origem.
* **Painel de Definições Gerais:** Alteração da fotografia da secção "Sobre Nós", atualização do logótipo, e gestão central de contactos de telefone e email visíveis publicamente.

### 3. Segurança e Infraestrutura
* **Modo Escuro (Dark Mode):** Exclusivo para o backoffice, proporcionando conforto visual aos administradores sem afetar o branding corporativo do lado dos clientes.
* **Row Level Security (RLS) no Supabase:** Regras extremamente estritas implementadas na tabela de `leads` (clientes normais apenas inserem dados, mas não conseguem aceder à tabela. Apenas administradores validados têm permissões de LEITURA e REJEIÇÃO).
* **Armazenamento de Imagens Segregado:** Buckets independentes para "Property Images" e "Insurance Images" garantido segurança e otimização.

## 🛠️ Como Iniciar o Projeto Localmente

Se clonar este projeto, siga os seguintes passos:

1. Instalar as dependências:
```bash
npm install
```

2. Configurar o Supabase. Crie um ficheiro `.env.local` na raiz contendo:
```env
NEXT_PUBLIC_SUPABASE_URL=a_sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=a_sua_anon_key_supabase
```

3. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

Abrir os endereços locais:
* Site Público: [http://localhost:3000](http://localhost:3000)
* Acesso Gestão: [http://localhost:3000/login](http://localhost:3000/login)

---
*Construído com atenção ao detalhe.*
