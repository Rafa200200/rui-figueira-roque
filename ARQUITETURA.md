# 🏗️ Arquitetura Completa — Rui Figueira & Roque

> Documento técnico para programadores. Explica **todo** o funcionamento da aplicação.

---

## 📋 Stack Tecnológica

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  Next.js 16.1.6 (App Router) · React 19 · TypeScript 5          │
│  Tailwind CSS 4 · Radix UI · Lucide Icons                        │
│  React Hook Form + Zod · TipTap Editor · Leaflet Maps           │
│  dnd-kit (drag & drop) · next-themes (dark mode)                 │
├─────────────────────────────────────────────────────────────────┤
│                        BACKEND                                    │
│  Supabase (PostgreSQL + Auth + Storage)                           │
│  Server Actions (Next.js) · Middleware (auth gate)                │
├─────────────────────────────────────────────────────────────────┤
│                        HOSTING                                    │
│  Cloudflare Workers via @opennextjs/cloudflare                    │
│  Edge Runtime · Assets CDN                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Visão Geral — Fluxo de um Request

```
                    ┌──────────────┐
                    │   Browser     │
                    └──────┬───────┘
                           │ HTTPS
                           ▼
              ┌────────────────────────┐
              │   Cloudflare Workers    │
              │   (Edge Runtime)        │
              │   wrangler.jsonc        │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   Next.js Middleware    │◄── src/middleware.ts
              │                        │
              │  1. Refresh sessão     │
              │  2. Verifica auth      │
              │  3. Redirect se needed │
              └────────────┬───────────┘
                           │
              ┌────────────┴───────────────┐
              │                            │
              ▼                            ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  Server Component │      │  Client Component │
    │  (RSC / SSR)      │      │  ("use client")   │
    │                   │      │                   │
    │  createClient()   │      │  createClient()   │
    │  (server.ts)      │      │  (client.ts)      │
    └────────┬─────────┘      └────────┬──────────┘
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │       SUPABASE          │
              │  xxxxx.supabase.co      │
              │  .supabase.co           │
              ├─────────┬──────────────┤
              │  Auth   │  PostgreSQL   │
              │         │              │
              │  Login  │  properties  │
              │  Sessão │  insurances  │
              │  Cookies│  leads       │
              │         │  site_settings│
              │         │  prop_images │
              ├─────────┼──────────────┤
              │       Storage           │
              │  property-photos        │
              │  site-assets            │
              └─────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
 ⚠️  TODA A APP ESTÁ PROTEGIDA — sem login não se vê nada!

 ┌───────────────────────────────────────────────────────────────┐
 │                     MIDDLEWARE (src/middleware.ts)              │
 │                                                                │
 │  Intercepta TODOS os requests (exceto _next/static, imagens)  │
 │  Delega para → src/lib/supabase/middleware.ts                  │
 └───────────────────────────────────────────┬────────────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────┐
                              │  updateSession()          │
                              │                           │
                              │  1. Cria Supabase client  │
                              │     com cookie handler    │
                              │                           │
                              │  2. supabase.auth.getUser()│
                              │     (refresh automático)  │
                              │                           │
                              │  3. Cookies com maxAge    │
                              │     de 2 HORAS            │
                              └──────────┬────────────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          │              │              │
                     Tem user?      Sem user       É /login?
                          │              │              │
                          ▼              ▼              ▼
                    ┌──────────┐  ┌────────────┐  ┌──────────┐
                    │ Continua │  │ Redirect   │  │ Continua │
                    │ request  │  │ → /login   │  │ (ok)     │
                    │ normal   │  │ ?redirect= │  │          │
                    └──────────┘  │ <url_orig> │  └──────────┘
                                  └────────────┘


 ┌───────────────────────────────────────────────────────────────┐
 │                LOGIN FORM (login-form.tsx)                     │
 │                                                                │
 │  Client Component · React Hook Form + Zod                     │
 │                                                                │
 │  supabase.auth.signInWithPassword({ email, password })        │
 │                                                                │
 │  Dois botões pós-login:                                        │
 │  ┌─────────────────────┐  ┌─────────────────────────┐         │
 │  │ "Entrar no Site"    │  │ "Entrar no Backoffice"  │         │
 │  │ → abre / (new tab)  │  │ → navega para /admin    │         │
 │  └─────────────────────┘  └─────────────────────────┘         │
 │                                                                │
 │  Mobile: delay 300ms para cookies serem escritos antes         │
 │  de navegar (fix Safari iOS)                                   │
 └───────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Schema da Base de Dados

```
┌──────────────────────────────────────────────────────┐
│                    site_settings                      │
│──────────────────────────────────────────────────────│
│  id          UUID (PK)                                │
│  key         TEXT (UNIQUE) ◄── ex: hero_title         │
│  value       TEXT                                     │
│  type        TEXT ◄── 'text' | 'richtext' | 'image'  │
│  group_name  TEXT ◄── 'homepage' | 'about' | 'footer' │
│                       'contacts' | 'credit' | 'social'│
│  created_at  TIMESTAMPTZ                              │
│  updated_at  TIMESTAMPTZ                              │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                     properties                        │
│──────────────────────────────────────────────────────│
│  id              UUID (PK)                            │
│  title           TEXT                                 │
│  slug            TEXT (UNIQUE) ◄── URL amigável       │
│  description     TEXT (HTML)                          │
│  price           DECIMAL                              │
│  business_type   TEXT ◄── 'sale' | 'rent'             │
│  property_type   TEXT ◄── 'apartment'|'house'|'land'  │
│                          'commercial'|'other'         │
│  typology        TEXT ◄── ex: "T3"                    │
│  area_m2         INTEGER                              │
│  bedrooms        INTEGER                              │
│  bathrooms       INTEGER                              │
│  energy_certificate TEXT                              │
│  district        TEXT                                 │
│  municipality    TEXT                                 │
│  parish          TEXT                                 │
│  latitude        DOUBLE ◄── (migração)                │
│  longitude       DOUBLE ◄── (migração)                │
│  features        TEXT[] ◄── array de características   │
│  tags            TEXT[] ◄── ex: ["Novo", "Exclusivo"] │
│  status          TEXT ◄── 'active'|'suspended'|'draft'│
│  featured        BOOLEAN                              │
│  display_order   INTEGER                              │
│  created_at      TIMESTAMPTZ                          │
│  updated_at      TIMESTAMPTZ                          │
│                                                       │
│  ──── 1:N ──── property_images                        │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  property_images                      │
│──────────────────────────────────────────────────────│
│  id              UUID (PK)                            │
│  property_id     UUID (FK) ◄── CASCADE delete         │
│  url             TEXT                                 │
│  alt_text        TEXT                                 │
│  display_order   INTEGER                              │
│  created_at      TIMESTAMPTZ                          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                     insurances                        │
│──────────────────────────────────────────────────────│
│  id                UUID (PK)                          │
│  name              TEXT                               │
│  slug              TEXT (UNIQUE)                      │
│  short_description TEXT                               │
│  full_description  TEXT (HTML)                        │
│  icon_name         TEXT                               │
│  icon_url          TEXT                               │
│  cover_image_url   TEXT                               │
│  benefits          JSONB ◄── ["Benefício 1", ...]     │
│  faqs              JSONB ◄── [{q:"...", a:"..."}]     │
│  form_fields       JSONB ◄── Schema dinâmico de form  │
│  status            TEXT ◄── 'active' | 'inactive'     │
│  display_order     INTEGER                            │
│  created_at        TIMESTAMPTZ                        │
│  updated_at        TIMESTAMPTZ                        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                       leads                           │
│──────────────────────────────────────────────────────│
│  id             UUID (PK)                             │
│  type           TEXT ◄── 'contact' | 'visit_request'  │
│                         | 'insurance_simulation'      │
│  name           TEXT                                  │
│  email          TEXT                                  │
│  phone          TEXT                                  │
│  message        TEXT                                  │
│  form_data      JSONB ◄── campos dinâmicos extras     │
│  property_id    UUID (FK) ◄── SET NULL on delete      │
│  insurance_id   UUID (FK) ◄── SET NULL on delete      │
│  status         TEXT ◄── 'new'|'in_progress'|'closed' │
│  internal_notes TEXT                                  │
│  created_at     TIMESTAMPTZ                           │
│  updated_at     TIMESTAMPTZ                           │
└──────────────────────────────────────────────────────┘
```

### Relações

```
properties ──1:N──► property_images    (CASCADE delete)
properties ──1:N──► leads              (SET NULL on delete)
insurances ──1:N──► leads              (SET NULL on delete)
```

---

## 📦 Storage (Supabase Buckets)

```
┌──────────────────────────────────────┐
│  Bucket: property-photos (PÚBLICO)   │
│  Fotos dos imóveis uploadadas admin  │
│  Acesso: SELECT público, CUD auth    │
├──────────────────────────────────────┤
│  Bucket: site-assets (PÚBLICO)       │
│  Hero banner, foto About, assets     │
│  Acesso: SELECT público, CUD auth    │
└──────────────────────────────────────┘
```

---

## 🗺️ Mapa de Rotas

```
/                                    ◄── Homepage (Server)
├── /login                           ◄── Login (Server + Client form)
│
├── /imoveis                         ◄── Listagem imóveis + filtros (Server)
│   └── /[slug]                      ◄── Detalhe imóvel + galeria + mapa + form visita
│
├── /seguros                         ◄── Listagem seguros (Server)
│   └── /[slug]                      ◄── Detalhe seguro + form simulação dinâmico
│
├── /credito-bancario                ◄── Página crédito (Server)
├── /contacto                        ◄── Contacto + form lead (Server)
├── /sobre-nos                       ◄── Sobre nós (Server)
│
├── /documentos
│   ├── /politica-privacidade        ◄── Política privacidade (Server)
│   └── /termos                      ◄── Termos e condições (Server)
│
├── /api
│   ├── /debug-settings              ◄── GET: debug settings (dev)
│   └── /seed-properties             ◄── GET: seed demo properties (dev)
│
└── /admin                           ◄── Dashboard (Server)
    ├── /imoveis                     ◄── Tabela CRUD imóveis
    │   ├── /novo                    ◄── Criar imóvel (form)
    │   └── /[id]/editar             ◄── Editar imóvel (form)
    │
    ├── /seguros                     ◄── Tabela CRUD seguros
    │   ├── /novo                    ◄── Criar seguro (form)
    │   └── /[id]/editar             ◄── Editar seguro (form)
    │
    ├── /leads                       ◄── Inbox de leads + métricas
    │   └── /[id]                    ◄── Detalhe de lead
    │
    ├── /conteudo                    ◄── Gerir conteúdos site (settings)
    └── /definicoes                  ◄── Alterar email/password admin
```

---

## ⚡ Server Actions vs API Routes

```
┌──────────────────────────────────────────────────────────────┐
│  SERVER ACTION: submitLead()                                  │
│  Ficheiro: src/app/actions/leads.ts                           │
│                                                               │
│  Chamado por: <LeadForm> (contacto, visita, simulação)        │
│  Recebe: FormData                                             │
│  Faz:                                                         │
│    1. Extrai nome, email, telefone, mensagem                  │
│    2. Mapeia campos dinâmicos (PT keywords heurísticos)       │
│    3. INSERT na tabela leads via Supabase server client        │
│    4. revalidatePath('/admin/leads')                           │
│  Retorna: { success, error }                                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  API ROUTE: /api/debug-settings (GET)                         │
│  Dev only — retorna credit settings para debug                │
├──────────────────────────────────────────────────────────────┤
│  API ROUTE: /api/seed-properties (GET)                        │
│  Dev only — insere 3 imóveis demo com imagens Unsplash        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Theming & Dark Mode

```
┌───────────────────────────────────────────────────────┐
│  ThemeProvider (theme-provider.tsx)                     │
│  Wrapper: next-themes                                  │
│  attribute="class"  defaultTheme="system"              │
│  enableSystem  disableTransitionOnChange                │
├───────────────────────────────────────────────────────┤
│  ThemeToggle (theme-toggle.tsx)                         │
│  Botão flutuante no root layout (bottom-right)         │
│  Visível em TODAS as páginas                            │
│  z-[9999] · rounded-full · shadow-lg                   │
├───────────────────────────────────────────────────────┤
│  CSS Variables (globals.css)                            │
│                                                        │
│  :root (light)          .dark                          │
│  bg-main: #FFFFFF       bg-main: #09090B               │
│  bg-alt:  #FAFAFA       bg-alt:  #18181B               │
│  text:    #111827       text:    #FAFAFA               │
│  muted:   #F3F4F6       muted:   #27272A               │
│  border:  #E5E7EB       border:  #27272A               │
│                                                        │
│  Brand (fixo ambos temas):                              │
│  primary: #4CAF50  dark: #2E7D32                        │
│  light:   #81C784  accent: #66BB6A                      │
├───────────────────────────────────────────────────────┤
│  Tailwind v4 custom variant:                            │
│  @custom-variant dark (&:where(.dark, .dark *));        │
│  Uso: dark:bg-zinc-950 dark:text-zinc-100 etc           │
└───────────────────────────────────────────────────────┘
```

---

## 🔄 Padrão de Data Fetching (por página)

```
┌────────────────────────────────────────────────────────────┐
│  PADRÃO: React Server Components + Supabase Server Client  │
│                                                             │
│  TODAS as páginas usam:                                     │
│    export const revalidate = 0  (sem cache, SSR puro)       │
│                                                             │
│  export default async function Page() {                     │
│    const supabase = await createClient()  // server.ts      │
│    const { data } = await supabase.from('...').select()     │
│    return <JSX com dados />                                 │
│  }                                                          │
│                                                             │
│  Nenhuma página usa:                                        │
│  ❌ useEffect / fetch no cliente                            │
│  ❌ useSWR / React Query                                    │
│  ❌ getServerSideProps (Pages Router)                       │
│                                                             │
│  Excepção: login usa Supabase BROWSER client (client.ts)    │
│  para auth.signInWithPassword()                             │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deploy Pipeline

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Código local │────►│  GitHub           │     │  Cloudflare       │
│  git push     │     │  main branch      │     │  Workers          │
└──────────────┘     └──────────────────┘     └────────┬─────────┘
                                                        │
                     ┌──────────────────┐               │
                     │  npm run deploy   │───────────────┘
                     │                   │
                     │  1. next build    │
                     │  2. opennextjs    │
                     │     -cloudflare   │
                     │     build         │
                     │  3. wrangler      │
                     │     deploy        │
                     └──────────────────┘

 ⚠️  Deploy é MANUAL (npm run deploy)
 ⚠️  Não há CI/CD (sem GitHub Actions)
```

---

## 🔧 Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave anon do Supabase>
```

> Ambas são `NEXT_PUBLIC_` — usadas tanto no servidor como no browser.
> Configuradas no Cloudflare Workers dashboard (secrets) e localmente via `.env.local`.

---

## 📊 Fluxo Completo: Submissão de Lead

```
Utilizador no site público
         │
         ▼
┌──────────────────────────┐
│  <LeadForm> (client)      │
│  type="visit_request"     │
│  propertyId="abc-123"     │
│                           │
│  Campos: nome, email,     │
│  telefone, mensagem       │
│  + campos dinâmicos       │
│  (insurances.form_fields) │
└──────────┬───────────────┘
           │ form submit
           ▼
┌──────────────────────────┐
│  Server Action:           │
│  submitLead(formData)     │
│                           │
│  1. Extrai campos padrão  │
│  2. Mapeia dinâmicos      │
│     (busca keywords PT)   │
│  3. supabase.insert()     │
│     → tabela leads        │
│  4. revalidatePath(       │
│     '/admin/leads')       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Admin vê no /admin/leads │
│  Status: "new"            │
│  Pode: alterar status,    │
│  adicionar notas internas │
└──────────────────────────┘
```

---

## ⚠️ Notas Importantes

| # | Nota |
|---|------|
| 1 | **Site inteiro está protegido** — sem login não se acede a nenhuma página pública. Isto é intencional (fase beta/teste). |
| 2 | **RLS desligado** — Row Level Security está comentado no schema. Segurança depende do middleware auth gate. |
| 3 | **Sessões de 2h** — Cookies expiram em 2 horas (hardcoded em middleware.ts e server.ts). |
| 4 | **revalidate = 0 everywhere** — Zero caching. Cada request faz query fresca ao Supabase. Performance depende da edge + Supabase. |
| 5 | **Sem signup** — Utilizadores admin são criados directamente no painel Supabase. |
| 6 | **form_fields dinâmicos** — Seguros podem ter formulários personalizados via JSONB. A lead-form renderiza estes campos automaticamente. |
| 7 | **Sem CI/CD** — Deploy manual via `npm run deploy`. |
| 8 | **Fonts** — Inter (corpo) + Outfit (headings) carregadas via `next/font/google`. |

---

*Gerado automaticamente em 12/03/2026. Mantém-te atualizado com as mudanças no código.*
