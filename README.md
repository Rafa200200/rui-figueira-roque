<div align="center">

# 🏠 Rui Figueira & Roque

**Mediação Imobiliária · Seguros · Crédito Bancário**

Plataforma completa com site público e backoffice de gestão, construída com as mais modernas tecnologias web.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Índice

- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Fluxo de Autenticação](#-fluxo-de-autenticação)
- [Base de Dados](#-base-de-dados)
- [Mapa de Rotas](#️-mapa-de-rotas)
- [Funcionalidades](#-funcionalidades)
- [Dark Mode](#-dark-mode)
- [Deploy](#-deploy)
- [Configuração Local](#-configuração-local)

---

## 🏗 Arquitetura do Sistema

> Visão geral do fluxo de um request, desde o browser até à base de dados.

```mermaid
flowchart TB
    Browser["🖥️ Browser"]
    CF["☁️ Cloudflare Workers\n(Edge Runtime)"]
    MW["🔐 Next.js Middleware\nRefresh sessão · Verifica auth · Redirect"]
    RSC["📄 Server Component\n(React Server Component)"]
    CC["⚡ Client Component\n('use client')"]
    SB["🗄️ Supabase\nPostgreSQL · Auth · Storage"]

    Browser -->|HTTPS| CF
    CF --> MW
    MW --> RSC
    MW --> CC
    RSC -->|"createClient() — server.ts"| SB
    CC -->|"createBrowserClient() — client.ts"| SB

    style Browser fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style CF fill:#fff7ed,stroke:#f97316,color:#c2410c
    style MW fill:#fef2f2,stroke:#ef4444,color:#b91c1c
    style RSC fill:#eff6ff,stroke:#3b82f6,color:#1d4ed8
    style CC fill:#ecfeff,stroke:#06b6d4,color:#0e7490
    style SB fill:#f0fdf4,stroke:#4CAF50,color:#14532d
```

---

## ⚡ Stack Tecnológica

| Categoria | Tecnologias |
|-----------|------------|
| **Framework** | Next.js 16.1.6 (App Router) · React 19 · TypeScript 5 |
| **Styling** | Tailwind CSS 4 · Radix UI (shadcn/ui) · Lucide Icons |
| **Base de Dados** | Supabase (PostgreSQL) |
| **Autenticação** | Supabase Auth (email/password + cookies) |
| **Storage** | Supabase Storage (2 buckets públicos) |
| **Formulários** | React Hook Form + Zod |
| **Editor Rich Text** | TipTap |
| **Mapas** | Leaflet + OpenStreetMap |
| **Drag & Drop** | dnd-kit |
| **Temas** | next-themes (light/dark) |
| **Hosting** | Cloudflare Workers via @opennextjs/cloudflare |
| **Fonts** | Inter (corpo) + Outfit (headings) via next/font |

---

## 🔐 Fluxo de Autenticação

> ⚠️ **Toda a aplicação está protegida.** Sem login não se acede a nenhuma página.

```mermaid
flowchart TB
    REQ["📨 Request chega\n(qualquer rota)"]
    MW["🛡️ Middleware — updateSession()\n1. Cria Supabase client com cookies\n2. supabase.auth.getUser()\n3. Cookies com maxAge: 2h"]
    HAS["✅ Tem sessão\nContinua normal"]
    NO["❌ Sem sessão\nRedirect → /login?redirect=URL"]
    LOGIN["📝 É /login\nPermite acesso"]

    REQ --> MW
    MW -->|Autenticado| HAS
    MW -->|Não autenticado| NO
    MW -->|Rota /login| LOGIN

    style REQ fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style MW fill:#fef2f2,stroke:#ef4444,color:#b91c1c
    style HAS fill:#f0fdf4,stroke:#4CAF50,color:#14532d
    style NO fill:#fff7ed,stroke:#f97316,color:#c2410c
    style LOGIN fill:#eff6ff,stroke:#3b82f6,color:#1d4ed8
```

### Pós-Login

Após login com sucesso, o utilizador vê dois botões:

| Botão | Ação | Detalhe |
|-------|------|---------|
| 🌐 **Entrar no Site** | `window.open("/", "_blank")` | Abre em nova tab |
| ⚙️ **Entrar no Backoffice** | `window.location.href = "/admin"` | Hard navigation (300ms delay no mobile) |

---

## 🗄 Base de Dados

> PostgreSQL via Supabase — 5 tabelas principais

```mermaid
erDiagram
    properties ||--o{ property_images : "1:N (CASCADE)"
    properties ||--o{ leads : "1:N (SET NULL)"
    insurances ||--o{ leads : "1:N (SET NULL)"

    properties {
        uuid id PK
        text title
        text slug UK
        text description
        decimal price
        text business_type "sale | rent"
        text property_type "apartment | house | land | ..."
        text typology
        int area_m2
        int bedrooms
        int bathrooms
        text district
        text municipality
        text parish
        double latitude
        double longitude
        text_arr features
        text_arr tags
        text status "active | suspended | draft"
        bool featured
        int display_order
    }

    property_images {
        uuid id PK
        uuid property_id FK
        text url
        text alt_text
        int display_order
    }

    insurances {
        uuid id PK
        text name
        text slug UK
        text short_description
        text full_description
        text icon_name
        text icon_url
        text cover_image_url
        jsonb benefits
        jsonb faqs
        jsonb form_fields "Schema dinamico"
        text status "active | inactive"
        int display_order
    }

    leads {
        uuid id PK
        text type "contact | visit_request | insurance_simulation"
        text name
        text email
        text phone
        text message
        jsonb form_data "Campos dinamicos extras"
        uuid property_id FK
        uuid insurance_id FK
        text status "new | in_progress | closed"
        text internal_notes
    }

    site_settings {
        uuid id PK
        text key UK
        text value
        text type "text | richtext | image"
        text group_name "homepage | about | footer | ..."
    }
```

### Storage (Supabase Buckets)

| Bucket | Conteúdo | Acesso |
|--------|----------|--------|
| 📷 `property-photos` | Fotos dos imóveis | SELECT público · CUD com auth |
| 🎨 `site-assets` | Hero banner, foto About, assets | SELECT público · CUD com auth |

---

## 🗺️ Mapa de Rotas

### Páginas Públicas

```mermaid
flowchart LR
    HOME["/ \n Homepage"]
    IMO["🏠 /imoveis\nListagem"]
    IMO_D["🏠 /imoveis/slug\nDetalhe"]
    SEG["🛡️ /seguros\nListagem"]
    SEG_D["🛡️ /seguros/slug\nDetalhe"]
    CRED["🏦 /credito-bancario"]
    CONT["📞 /contacto"]
    ABOUT["👥 /sobre-nos"]
    PRIV["📄 /documentos/\npolitica-privacidade"]
    TERMS["📄 /documentos/\ntermos"]
    LOGIN["🔐 /login"]

    HOME --> IMO --> IMO_D
    HOME --> SEG --> SEG_D
    HOME --> CRED
    HOME --> CONT
    HOME --> ABOUT
    HOME --> PRIV
    HOME --> TERMS
    LOGIN -.->|auth| HOME

    style HOME fill:#f0fdf4,stroke:#4CAF50,color:#14532d
    style LOGIN fill:#fef2f2,stroke:#ef4444,color:#b91c1c
    style IMO fill:#eff6ff,stroke:#3b82f6,color:#1d4ed8
    style IMO_D fill:#eff6ff,stroke:#3b82f6,color:#1d4ed8
    style SEG fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style SEG_D fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style CRED fill:#fff7ed,stroke:#f97316,color:#c2410c
    style CONT fill:#ecfeff,stroke:#06b6d4,color:#0e7490
    style ABOUT fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style PRIV fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style TERMS fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
```

### Admin (Backoffice)

```mermaid
flowchart LR
    ADMIN["⚙️ /admin\nDashboard"]
    A_IMO["🏠 /admin/imoveis\nTabela CRUD"]
    A_IMO_N["➕ /novo"]
    A_IMO_E["✏️ /id/editar"]
    A_SEG["🛡️ /admin/seguros\nTabela CRUD"]
    A_SEG_N["➕ /novo"]
    A_SEG_E["✏️ /id/editar"]
    A_LEADS["📩 /admin/leads\nInbox"]
    A_LEAD_D["📋 /id\nDetalhe"]
    A_CONT["📝 /admin/conteudo\nSettings do site"]
    A_DEF["🔧 /admin/definicoes\nConta admin"]

    ADMIN --> A_IMO --> A_IMO_N
    A_IMO --> A_IMO_E
    ADMIN --> A_SEG --> A_SEG_N
    A_SEG --> A_SEG_E
    ADMIN --> A_LEADS --> A_LEAD_D
    ADMIN --> A_CONT
    ADMIN --> A_DEF

    style ADMIN fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_IMO fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_IMO_N fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_IMO_E fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_SEG fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_SEG_N fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_SEG_E fill:#faf5ff,stroke:#a855f7,color:#7e22ce
    style A_LEADS fill:#fff7ed,stroke:#f97316,color:#c2410c
    style A_LEAD_D fill:#fff7ed,stroke:#f97316,color:#c2410c
    style A_CONT fill:#ecfeff,stroke:#06b6d4,color:#0e7490
    style A_DEF fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
```

---

## 🌟 Funcionalidades

### Site Público

| Funcionalidade | Descrição |
|----------------|-----------|
| **Homepage com Banner** | Hero com imagem de fundo configurável pelo admin, overlay escuro, texto com drop-shadow |
| **Portefólio de Imóveis** | Listagem com filtros (tipo, negócio, localização), galeria lightbox, mapa de localização |
| **Seguros** | Listagem de apólices, detalhe com benefícios, FAQs e formulário de simulação dinâmico |
| **Crédito Bancário** | Página informativa com parceiros de crédito habitação |
| **Captura de Leads** | Formulários inteligentes em contacto, visita a imóveis e simulação de seguros |
| **Mapa com Privacidade** | Localização aproximada (sem expor morada exata) via Leaflet/OpenStreetMap |

### Backoffice (Admin)

| Funcionalidade | Descrição |
|----------------|-----------|
| **CRUD Imóveis** | Criar, editar, eliminar propriedades com galeria drag-and-drop |
| **CRUD Seguros** | Gestão de apólices com editor Rich Text (TipTap) e formulários dinâmicos via JSONB |
| **Inbox de Leads** | CRM básico com filtros, métricas, notas internas e gestão de status |
| **Gestão de Conteúdos** | Alterar textos, imagens e configurações de todas as páginas do site |
| **Definições** | Alteração de email e password do admin |
| **Geocodificação** | Map picker para seleccionar coordenadas dos imóveis |

### Fluxo de Lead (end-to-end)

```mermaid
flowchart LR
    USER["👤 Utilizador\npreenche formulário"]
    FORM["📝 LeadForm\n(Client Component)"]
    ACTION["⚡ submitLead()\n(Server Action)"]
    DB["🗄️ Supabase\ntabela leads"]
    ADMIN["👨‍💼 Admin\n/admin/leads"]

    USER -->|"submit"| FORM
    FORM -->|"Server Action"| ACTION
    ACTION -->|"INSERT + revalidatePath"| DB
    DB -->|"visível"| ADMIN

    style USER fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style FORM fill:#ecfeff,stroke:#06b6d4,color:#0e7490
    style ACTION fill:#eff6ff,stroke:#3b82f6,color:#1d4ed8
    style DB fill:#f0fdf4,stroke:#4CAF50,color:#14532d
    style ADMIN fill:#faf5ff,stroke:#a855f7,color:#7e22ce
```

---

## 🌙 Dark Mode

Sistema completo de dark mode com `next-themes`:

| Configuração | Valor |
|-------------|-------|
| **Provider** | `next-themes` com `attribute="class"` |
| **Default** | `system` (respeita preferência do OS) |
| **Toggle** | Botão flutuante global (bottom-right, visível em todas as páginas) |
| **Tailwind** | `@custom-variant dark (&:where(.dark, .dark *));` |

**Cores da marca (fixas em ambos os temas):**

| Cor | Hex | Uso |
|-----|-----|-----|
| 🟢 Primary | `#4CAF50` | Botões, links, destaques |
| 🟢 Dark | `#2E7D32` | Hover states, gradientes |
| 🟢 Light | `#81C784` | Backgrounds subtis |
| 🟢 Accent | `#66BB6A` | Elementos secundários |

---

## 🚀 Deploy

```mermaid
flowchart LR
    LOCAL["💻 Código local"]
    GH["🐙 GitHub\nmain branch"]
    BUILD["📦 npm run deploy\n1. next build\n2. opennextjs-cloudflare build\n3. wrangler deploy"]
    CF["☁️ Cloudflare\nWorkers + CDN"]

    LOCAL -->|"git push"| GH
    LOCAL -->|"npm run deploy"| BUILD
    BUILD --> CF

    style LOCAL fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style GH fill:#f4f4f5,stroke:#a1a1aa,color:#3f3f46
    style BUILD fill:#eff6ff,stroke:#3b82f6,color:#1d4ed8
    style CF fill:#fff7ed,stroke:#f97316,color:#c2410c
```

> ⚠️ **Deploy é manual** — executa-se `npm run deploy` localmente. Não há CI/CD configurado.

---

## 🛠 Configuração Local

### Pré-requisitos

- Node.js 18+
- Conta Supabase com projeto configurado

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/Rafa200200/rui-figueira-roque.git
cd rui-figueira-roque

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
```

### Variáveis de Ambiente

Criar ficheiro `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```

| Variável | Descrição | Onde obter |
|----------|-----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública | Supabase Dashboard → Settings → API |

### Comandos

```bash
npm run dev       # Servidor de desenvolvimento (Turbopack)
npm run build     # Build de produção
npm run deploy    # Build + deploy para Cloudflare Workers
```

### Base de Dados

Executar os ficheiros SQL no Supabase SQL Editor por esta ordem:

1. `supabase/schema.sql` — Criação de tabelas
2. `supabase/storage.sql` — Configuração de buckets
3. `supabase/seed.sql` — Dados iniciais (settings do site)
4. `supabase/migrations/20260310_add_coordinates.sql` — Coordenadas GPS

---

## ⚠️ Notas Importantes

> [!WARNING]
> **Site protegido por login** — todas as páginas (incluindo públicas) requerem autenticação. Isto é intencional para a fase de testes.

> [!WARNING]
> **RLS desligado** — Row Level Security está comentado. A segurança depende do middleware auth gate.

> [!NOTE]
> **Sessões de 2h** — cookies expiram em 7200s. Fix para Safari iOS.

> [!NOTE]
> **revalidate = 0** — sem cache em nenhuma página. SSR puro em cada request.

> [!NOTE]
> **Sem signup** — admins criados manualmente no painel Supabase (Authentication → Users).

---

<div align="center">

**Rui Figueira & Roque Lda** · Mediação Imobiliária AMI · Mediação de Seguros ASF

*Desenvolvido com ❤️ usando Next.js, Supabase e Cloudflare Workers*

</div>


