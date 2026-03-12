<div align="center">

# 📖 Guia do Utilizador

### Rui Figueira & Roque Lda — Backoffice

**Manual completo de gestão do site institucional**

Última atualização: Março 2026

</div>

---

## 📋 Índice

1. [Acesso ao Backoffice (Login)](#1--acesso-ao-backoffice-login)
2. [Dashboard — Painel de Controlo](#2--dashboard--painel-de-controlo)
3. [Gestão de Imóveis](#3--gestão-de-imóveis)
   - [Criar Novo Imóvel](#31-criar-novo-imóvel)
   - [Editar Imóvel Existente](#32-editar-imóvel-existente)
   - [Apagar Imóvel](#33-apagar-imóvel)
   - [Estados de Publicação](#34-estados-de-publicação)
4. [Gestão de Seguros](#4--gestão-de-seguros)
   - [Criar Novo Seguro](#41-criar-novo-seguro)
   - [Construtor de Formulário](#42-construtor-de-formulário)
   - [Vantagens e FAQs](#43-vantagens-e-faqs)
5. [Gestão de Leads (Oportunidades)](#5--gestão-de-leads-oportunidades)
   - [Caixa de Entrada](#51-caixa-de-entrada)
   - [Ver Detalhes de uma Lead](#52-ver-detalhes-de-uma-lead)
   - [Alterar Estado de uma Lead](#53-alterar-estado-de-uma-lead)
   - [Notas Internas](#54-notas-internas)
6. [Conteúdo do Site](#6--conteúdo-do-site)
   - [Homepage (Títulos e Banner)](#61-homepage-títulos-e-banner)
   - [Sobre Nós (Biografia e Foto)](#62-sobre-nós-biografia-e-foto)
   - [Contactos (Departamentos)](#63-contactos-departamentos)
   - [Crédito Bancário](#64-crédito-bancário)
   - [Redes Sociais (WhatsApp)](#65-redes-sociais-whatsapp)
7. [Definições da Conta](#7--definições-da-conta)
8. [Páginas Públicas do Site](#8--páginas-públicas-do-site)
9. [Dicas e Boas Práticas](#9--dicas-e-boas-práticas)
10. [Resolução de Problemas](#10--resolução-de-problemas)

---

## 1. 🔑 Acesso ao Backoffice (Login)

### Como entrar no painel de gestão

1. Abra o browser e aceda ao endereço do site seguido de `/login`
2. Introduza o **e-mail** e a **palavra-passe** fornecidos
3. Clique em **"Entrar no Backoffice"**

Será redirecionado para o **Painel de Controlo** (Dashboard).

> **💡 Dica:** O botão **"Entrar no Site"** permite-lhe entrar na sessão e abrir o site público em simultâneo — útil para verificar alterações que acabou de fazer.

### Terminar sessão

No menu lateral (sidebar), clique no botão **"Terminar Sessão"** no fundo da barra lateral esquerda.

---

## 2. 📊 Dashboard — Painel de Controlo

O Dashboard é a primeira página que vê ao entrar. Apresenta um resumo geral do estado do site:

| Cartão | O que mostra |
|--------|-------------|
| **Imóveis Ativos** | Número de imóveis visíveis no site público |
| **Seguros Ativos** | Número de seguros com formulário ativo |
| **Leads Novas** | Contactos de clientes ainda **por ler** (fundo vermelho = urgente) |
| **Pedidos de Visita** | Quantos clientes pediram para visitar um imóvel |

### Secções adicionais

- **Leads Recentes** — Os últimos 5 contactos recebidos com nome, tipo e data
- **Imóveis Recentes** — Os últimos 5 imóveis adicionados com preço e localização

> Pode clicar em qualquer item para aceder diretamente aos detalhes.

---

## 3. 🏠 Gestão de Imóveis

Aceda através do menu lateral: **Imóveis**

Verá uma tabela com todos os imóveis, mostrando foto, título, tipo de negócio (Venda/Arrendamento), tipologia, localização, preço e estado.

### 3.1 Criar Novo Imóvel

1. Clique no botão **"Adicionar Imóvel"** (canto superior direito)
2. Preencha o formulário organizado por secções:

#### Secção: Informação Principal
| Campo | Descrição | Obrigatório |
|-------|-----------|:-----------:|
| **Título do Imóvel** | Nome que aparece no site (ex: "Moradia T3 com Piscina em Cascais") | ✅ |
| **Descrição Detalhada** | Texto rico com formatação (negrito, listas, etc.) | ✅ |
| **Preço (€)** | Valor em euros | ✅ |
| **Tipo de Negócio** | Venda ou Arrendamento | ✅ |

#### Secção: Características Gerais
| Campo | Descrição | Obrigatório |
|-------|-----------|:-----------:|
| **Tipo de Imóvel** | Apartamento, Moradia, Terreno, Espaço Comercial, Outro | ✅ |
| **Tipologia** | T0, T1, T2, T3, T4, T5+ | ✅ |
| **Área Bruta (m²)** | Área total em metros quadrados | ✅ |
| **Quartos** | Número de quartos (só para Apartamento/Moradia) | ❌ |
| **Casas de Banho** | Número de WC (só para Apartamento/Moradia) | ❌ |
| **Certificado Energético** | De A+ a F, ou Isento | ✅ |

#### Secção: Localização
| Campo | Descrição | Obrigatório |
|-------|-----------|:-----------:|
| **Distrito** | Selecione da lista de distritos de Portugal | ✅ |
| **Concelho** | Escreva o nome do concelho | ✅ |
| **Freguesia** | Freguesia (opcional mas recomendado) | ❌ |
| **Morada Completa** | Endereço exato (não é mostrado publicamente na íntegra) | ❌ |
| **Mapa** | Clique em "Procurar Morada" para localizar automaticamente, ou clique diretamente no mapa para ajustar o pin | ❌ |

> **💡 Dica sobre o Mapa:** Preencha primeiro o concelho e distrito, depois clique em **"Procurar Morada"**. Se não encontrar a localização exata, pode clicar diretamente no mapa para posicionar o marcador manualmente.

#### Secção: Extras & Detalhes
Clique em **"Novo Extra"** para adicionar características como:
- Cozinha Equipada
- Ar Condicionado
- Garagem
- Piscina
- Varanda
- Etc.

Pode adicionar quantas quiser e reordenar. Para remover, clique no ícone do lixo 🗑️.

#### Secção: Galeria Fotográfica
- Clique na área de upload ou arraste fotos para carregar
- Formatos aceites: **JPG, PNG, WebP** (máximo 5MB por ficheiro)
- Pode carregar várias fotos de uma vez
- **Para reordenar:** arraste e largue as fotos na ordem desejada — a primeira foto será a capa do imóvel no site
- Para remover uma foto, clique no **X** que aparece ao passar o rato sobre ela

#### Secção: Visibilidade & Destaques
| Campo | Descrição |
|-------|-----------|
| **Estado de Publicação** | 🟢 Ativo (visível no site), 🟡 Suspenso (invisível), ⚪ Rascunho (gestão interna) |
| **Destacar na Homepage** | Se marcado, o imóvel aparece na secção de destaques da página principal |

3. Clique em **"Guardar Alterações do Imóvel"**

### 3.2 Editar Imóvel Existente

1. Na tabela de imóveis, clique no ícone de **lápis** ✏️ na linha do imóvel
2. Faça as alterações desejadas
3. Clique em **"Guardar Alterações do Imóvel"**

### 3.3 Apagar Imóvel

1. Na tabela de imóveis, clique no ícone de **lixo** 🗑️
2. Confirme a eliminação na janela de diálogo

> ⚠️ **Atenção:** A eliminação é permanente e não pode ser revertida.

### 3.4 Estados de Publicação

| Estado | Ícone | Significado |
|--------|:-----:|------------|
| **Ativo** | 🟢 | O imóvel está visível para todos os visitantes do site |
| **Suspenso** | 🟡 | O imóvel está oculto no site mas mantém-se no sistema (ex: temporariamente indisponível) |
| **Rascunho** | ⚪ | Apenas visível no backoffice — útil para preparar uma listagem antes de a publicar |

> **💡 Dica:** Quando um imóvel é vendido/arrendado, mude o estado para **Suspenso** em vez de o apagar. Assim mantém o registo no sistema caso precise de o reativar.

---

## 4. 🛡️ Gestão de Seguros

Aceda através do menu lateral: **Seguros**

Verá uma tabela com todos os seguros configurados, mostrando ordem, nome, número de campos no formulário e estado.

### 4.1 Criar Novo Seguro

1. Clique em **"Adicionar Seguro"**
2. O formulário está dividido em duas colunas:

**Coluna esquerda — Informação Geral:**

| Campo | Descrição | Obrigatório |
|-------|-----------|:-----------:|
| **Nome do Seguro** | Ex: "Seguro Automóvel", "Seguro de Saúde" | ✅ |
| **Breve Descrição** | Texto curto que aparece nos cards da página de seguros | ✅ |
| **Descrição Detalhada** | Texto rico completo para a página individual do seguro | ✅ |
| **Visibilidade** | 🟢 Ativo ou ⚪ Inativo | ✅ |
| **Ordem Layout** | Número que define a posição na lista (0 = primeiro) | ✅ |

**Identidade Visual:**
- **Imagem de Capa** — Foto grande que aparece na página do seguro (clique para carregar)
- **Logótipo / Ícone** — Ícone pequeno para os cards (formatos SVG ou PNG transparente)

### 4.2 Construtor de Formulário

A coluna direita permite configurar os **campos do formulário de simulação** que os clientes preenchem.

**Campos obrigatórios do sistema** (não podem ser removidos):
- Nome
- E-mail
- Telefone

**Para adicionar campos personalizados:**
1. Clique em **"Novo Campo"**
2. Configure:
   - **ID Único** — Identificador interno (ex: `matricula_carro`)
   - **Tipo de Campo** — Texto, E-mail, Telefone, Número, Lista de Opções, Data, Seleção Sim/Não
   - **Título visível** — O que o cliente vê (ex: "Matrícula do Veículo")
   - **Obrigatório** — Se o cliente é obrigado a preencher

**Para campos do tipo "Lista de Opções":**
- Aparece um campo extra onde deve escrever as opções separadas por vírgula
- Exemplo: `Ligeiro, Pesado, Moto, Outro`

### 4.3 Vantagens e FAQs

**Vantagens e Coberturas:**
- Clique em **"Adicionar Vantagem"** para listar benefícios do seguro
- Exemplo: "Assistência 24/7", "Cobertura contra terceiros"

**Perguntas Frequentes:**
- Clique em **"Adicionar FAQ"** para criar pares de Pergunta/Resposta
- Estas aparecem na página pública do seguro

> **💡 Dica:** As FAQs ajudam os clientes a esclarecer dúvidas antes de pedir simulação, reduzindo contactos desnecessários.

---

## 5. 📬 Gestão de Leads (Oportunidades)

Aceda através do menu lateral: **Leads**

As leads são contactos enviados pelos visitantes do site. Existem **3 tipos**:

| Tipo | Ícone | Origem |
|------|:-----:|--------|
| **Contacto Geral** | 📧 | Formulário da página de contacto |
| **Pedido de Visita** | 📍 | Formulário na página de um imóvel |
| **Simulação de Seguro** | 🛡️ | Formulário na página de um seguro |

### 5.1 Caixa de Entrada

A caixa de entrada mostra todas as leads com:

- **Filtros de pesquisa** — Pode pesquisar por nome ou email
- **Filtro por tipo** — Todos, Contactos, Visitas ou Seguros
- **Filtro por estado** — Todos, Novas, Em Tratamento, Fechadas

As leads **novas** (por ler) aparecem com um fundo **vermelho claro** para chamar atenção.

### 5.2 Ver Detalhes de uma Lead

Clique no ícone do **olho** 👁️ ou diretamente na lead para abrir os detalhes.

Verá:
- **Dados de contacto** — Nome, e-mail e telefone do cliente
- **Contexto do pedido** — Se é sobre um imóvel ou seguro específico, com link direto
- **Mensagem do cliente** — O texto enviado ou dados do formulário de simulação
- **Notas internas** — Espaço privado para as suas notas (nunca visível para o cliente)

### 5.3 Alterar Estado de uma Lead

| Estado | Significado |
|--------|------------|
| **Nova** | Acabou de chegar, ainda não foi lida |
| **Em Tratamento** | Já foi vista (muda automaticamente ao abrir) |
| **Fechada** | Assunto resolvido |

- Para **fechar** uma lead: clique em **"Finalizar"**
- Para **reabrir** uma lead fechada: clique em **"Reabrir"**
- Para **apagar** uma lead: clique em **"Apagar"** e confirme

> **💡 Dica:** Ao abrir uma lead nova, o estado muda automaticamente para "Em Tratamento". Não precisa de fazer nada manualmente.

### 5.4 Notas Internas

O campo de **notas internas** é um espaço privado para si:
- Registar o que foi combinado com o cliente
- Anotar follow-ups pendentes
- Qualquer observação que considere relevante

Clique em **"Guardar Nota"** após escrever.

> ⚠️ As notas internas são **apenas visíveis no backoffice** e nunca são partilhadas com o cliente.

---

## 6. 📝 Conteúdo do Site

Aceda através do menu lateral: **Conteúdo**

Esta é a secção mais importante para personalizar o site. Está organizada em **5 separadores (tabs)**:

### 6.1 Homepage (Títulos e Banner)

| Campo | O que controla |
|-------|---------------|
| **Título Principal (Hero)** | O texto grande que aparece em cima da imagem de fundo na homepage |
| **Subtítulo Explicativo** | O texto mais pequeno por baixo do título principal |
| **Imagem de Fundo do Banner** | A foto panorâmica que aparece como fundo do topo da homepage |

**Para alterar a imagem do banner:**
- **Opção 1:** Clique na imagem (ou na área de upload) e selecione uma foto do computador
  - Formato recomendado: **panorâmica 1920×640 pixels**, JPG/PNG/WebP, máximo 2MB
- **Opção 2:** Cole um link direto (URL) de uma imagem externa

> **💡 Dica:** Use fotos com boa resolução horizontal. Fotos verticais ou quadradas ficam cortadas no banner.

### 6.2 Sobre Nós (Biografia e Foto)

| Campo | O que controla |
|-------|---------------|
| **Biografia / Apresentação** | O texto da secção "Sobre Nós" na homepage (suporta formatação rica: negrito, listas, etc.) |
| **Fotografia de Destaque** | A foto que aparece ao lado da biografia |

**Para alterar a fotografia:**
- Clique na imagem existente e selecione uma nova foto, ou cole um URL direto
- Formato recomendado: **retrato (vertical)**, máximo 2MB

### 6.3 Contactos (Departamentos)

Os contactos estão organizados por **4 departamentos**:

#### 📍 Localização & Logística
| Campo | O que controla |
|-------|---------------|
| **Morada Física Central** | Endereço que aparece no footer e na página de contacto |
| **Horário de Funcionamento** | Ex: "Segunda a Sexta, 09h00 - 18h00" |

#### 🏠 Departamento Imobiliário
| Campo | O que controla |
|-------|---------------|
| **Telefone Principal** | Número do departamento imobiliário |
| **E-mail de Contacto** | Email do departamento imobiliário |

#### 🛡️ Departamento de Seguros
| Campo | O que controla |
|-------|---------------|
| **Telefone Especializado** | Número do departamento de seguros |
| **E-mail Especializado** | Email do departamento de seguros |

#### 💰 Intermediação de Crédito
| Campo | O que controla |
|-------|---------------|
| **Contacto Créditos** | Número do departamento de crédito |
| **E-mail Créditos** | Email do departamento de crédito |

> Estes contactos são usados automaticamente na **página de Contacto**, no **footer** e nas páginas de cada serviço.

### 6.4 Crédito Bancário

| Campo | O que controla |
|-------|---------------|
| **Registo Banco de Portugal** | Número BdP que aparece por obrigação legal em todas as menções a crédito (ex: "BdP 0006370") |
| **Link do Registo BdP** | Se preenchido, o badge torna-se clicável para o site do Banco de Portugal |
| **Título da Página** | Título principal da página de crédito bancário |
| **Apresentação dos Serviços** | Texto rico com descrição dos serviços de crédito (lado esquerdo da página) |
| **Título da Caixa de Vantagens** | Título do bloco de vantagens (lado direito) |
| **Texto de Vantagens** | Conteúdo rico que descreve os benefícios do serviço |

> ⚠️ **Nota Legal:** O número de registo do Banco de Portugal é **obrigatório por lei** e aparece automaticamente em todas as páginas que mencionam crédito.

### 6.5 Redes Sociais (WhatsApp)

| Campo | O que controla |
|-------|---------------|
| **Número WhatsApp** | Número usado no botão de apoio rápido do site. Formato: apenas números com indicativo (ex: `351912345678`) |

> **💡 Dica:** Não inclua espaços, traços ou sinais de "+". Apenas os dígitos (ex: 351 seguido dos 9 dígitos do telemóvel).

### ❗ Guardar Alterações

Depois de editar qualquer campo nos separadores acima, clique em **"Guardar Alterações"** no canto superior direito. Uma mensagem verde de confirmação aparecerá.

> As alterações ficam **imediatamente visíveis** no site público após guardar.

---

## 7. ⚙️ Definições da Conta

Aceda através do menu lateral: **Definições**

### Detalhes da Conta
- Mostra o **e-mail associado** à sua conta (não pode ser alterado)

### Alterar Palavra-passe
1. Escreva a nova palavra-passe (mínimo 6 caracteres)
2. Confirme a nova palavra-passe
3. Clique em **"Atualizar Palavra-passe"**

> A próxima vez que iniciar sessão, use a nova palavra-passe.

---

## 8. 🌐 Páginas Públicas do Site

O site público (visível para todos os visitantes) é composto pelas seguintes páginas:

| Página | O que mostra |
|--------|-------------|
| **Homepage** (`/`) | Banner com título, secção de imóveis em destaque, secção "Sobre Nós", serviços de seguros e crédito |
| **Imóveis** (`/imoveis`) | Listagem de todos os imóveis ativos com filtros por distrito, tipo de negócio, tipologia e preço |
| **Detalhe do Imóvel** (`/imoveis/[nome]`) | Página completa com galeria de fotos, descrição, características, mapa e formulário de visita |
| **Seguros** (`/seguros`) | Listagem de todos os seguros ativos em formato de cards |
| **Detalhe do Seguro** (`/seguros/[nome]`) | Página completa com descrição, vantagens, FAQs e formulário de simulação |
| **Contacto** (`/contacto`) | Mapa, morada, contactos por departamento e formulário de contacto geral |
| **Sobre Nós** (`/sobre-nos`) | Apresentação da empresa com biografia e fotografia |
| **Crédito Bancário** (`/credito-bancario`) | Informação sobre intermediação de crédito com registo BdP |
| **Política de Privacidade** (`/documentos/politica-privacidade`) | Texto legal obrigatório |
| **Termos e Condições** (`/documentos/termos`) | Texto legal obrigatório |

### Como os visitantes enviam contactos

Os visitantes podem contactá-lo de **3 formas** através do site:

1. **Formulário de Contacto Geral** (página `/contacto`)
   - Nome, e-mail, telefone e mensagem
   
2. **Pedido de Visita** (página de cada imóvel)
   - Nome, e-mail, telefone, data preferida e mensagem
   
3. **Simulação de Seguro** (página de cada seguro)
   - Os campos que configurou no Construtor de Formulário (ver secção 4.2)

Todos estes contactos chegam à sua **Caixa de Leads** no backoffice (ver secção 5).

### Pesquisa de Imóveis

Na página pública de imóveis, os visitantes podem filtrar por:
- **Distrito** (todos os distritos de Portugal)
- **Tipo de Negócio** (Venda ou Arrendamento)
- **Tipologia** (T0 a T5+)
- **Preço Mínimo e Máximo**

---

## 9. 💡 Dicas e Boas Práticas

### Fotos dos Imóveis
- ✅ Use fotos com **boa iluminação** e **boa resolução**
- ✅ A **primeira foto** da galeria é a capa — escolha a mais apelativa
- ✅ Carregue **pelo menos 5 fotos** por imóvel para mais engagement
- ✅ Use formatos **JPG** (mais leve) ou **WebP** (melhor qualidade/peso)
- ❌ Evite fotos desfocadas, escuras ou com marcas de água de outros sites

### Textos e Descrições
- ✅ Escreva títulos **claros e objetivos** (ex: "Apartamento T2 Renovado no Centro de Lisboa")
- ✅ Use o **editor rico** para formatar a descrição com parágrafos, negrito e listas
- ✅ Inclua as **principais características** logo no início da descrição
- ❌ Evite TUDO EM MAIÚSCULAS ou pontuação excessiva (!!!)

### Seguros
- ✅ Mantenha a **breve descrição** dos cards curta e apelativa (2-3 frases)
- ✅ Adicione pelo menos **3 vantagens** para cada seguro
- ✅ Configure **FAQs** para reduzir contactos com dúvidas repetidas
- ✅ Defina o campo de **ordem** para controlar a disposição dos cards

### Leads
- ✅ Consulte a caixa de leads **diariamente**
- ✅ Responda rapidamente — os visitantes esperam contacto em **24-48 horas**
- ✅ Use as **notas internas** para registar interações
- ✅ **Feche** as leads resolvidas para manter a caixa organizada

### Conteúdo do Site
- ✅ Atualize o **banner da homepage** sazonalmente para manter o site fresco
- ✅ Mantenha os **contactos sempre atualizados** — um número errado = cliente perdido
- ✅ Reveja a **biografia** periodicamente

---

## 10. 🔧 Resolução de Problemas

### "Não consigo fazer login"
- Verifique se está a usar o e-mail e palavra-passe corretos
- Verifique se tem letras maiúsculas/minúsculas corretas na password
- Se esqueceu a password, contacte o administrador técnico para reset

### "Fiz alterações mas não aparecem no site"
- Certifique-se que clicou em **"Guardar Alterações"** ou **"Guardar"**
- Limpe a cache do browser: **Ctrl + Shift + R** (ou **Cmd + Shift + R** no Mac)
- Aguarde 30 segundos e atualize a página

### "As fotos não carregam"
- Verifique se o ficheiro tem menos de **5MB**
- Verifique se o formato é **JPG, PNG ou WebP**
- Tente com outra foto para descartar problemas no ficheiro original

### "O mapa não mostra a localização correta"
- Preencha primeiro o **concelho** e **distrito**, depois clique em "Procurar Morada"
- Se a pesquisa automática falhar, **clique diretamente no mapa** para posicionar o pin manualmente
- O pin pode ser arrastado para a posição exata

### "Um imóvel não aparece no site"
- Verifique se o **estado** é "Ativo" (🟢) — apenas imóveis ativos são visíveis
- Imóveis em "Suspenso" (🟡) ou "Rascunho" (⚪) ficam ocultos do público

### "Um seguro não aparece no site"
- Verifique se o **estado** é "Ativo" — seguros inativos ficam ocultos
- Verifique se a **ordem de layout** não está a colocar o seguro fora da vista

### "Recebo muitas leads de spam"
- Os formulários do site já incluem validação de campos obrigatórios
- Contacte o administrador técnico se o problema persistir

---

<div align="center">

### Precisa de ajuda técnica?

Se encontrar um problema não coberto por este guia, contacte o suporte técnico.

---

**Guia criado para** Rui Figueira & Roque Lda

</div>
