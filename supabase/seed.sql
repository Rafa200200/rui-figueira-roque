-- Seed script to populate initial data

-- 1. Site Settings
INSERT INTO site_settings (key, value, type, group_name) VALUES
('about_title', 'A sua casa nas mãos de quem confia', 'text', 'about'),
('about_bio', '<p>Rui Figueira & Roque Lda é uma agência que junta a paixão pelo imobiliário ao compromisso com a sua segurança.</p>', 'richtext', 'about'),
('about_mission', '<p>A nossa missão é ajudá-lo a encontrar a sua casa de sonho, garantindo que tudo e todos estão protegidos passo-a-passo.</p>', 'richtext', 'about'),
('about_photo', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', 'image', 'about'),
('footer_address', 'Avenida Principal, 123, 1000-001 Lisboa', 'text', 'footer'),
('footer_hours', 'Segunda a Sexta, 09h00 - 18h00', 'text', 'footer'),
('contact_realestate_phone', '+351 912 345 678', 'text', 'contacts'),
('contact_realestate_email', 'imoveis@ruifigueiraroque.pt', 'text', 'contacts'),
('contact_insurance_phone', '+351 910 111 222', 'text', 'contacts'),
('contact_insurance_email', 'seguros@ruifigueiraroque.pt', 'text', 'contacts'),
('contact_credit_phone', '+351 917 386 783', 'text', 'contacts'),
('contact_credit_email', 'rfr.creditos@gmail.com', 'text', 'contacts'),
('credit_bdp_number', 'BdP 0006370', 'text', 'credit'),
('credit_title', 'INTERMEDIÁRIO DE CRÉDITO VINCULADO', 'text', 'credit'),
('credit_text', '<p>Escolher um crédito é uma decisão importante. Nós ajudamos a torná-la simples e segura.</p><p>Na Rui Figueira & Roque Lda fazemos intermediação de crédito vinculado, procurando sempre as melhores soluções para si:</p><ul><li>Crédito Habitação – apoio na compra da sua casa.</li><li>Crédito Consolidado – simplificação e melhor gestão financeira.</li></ul><p>Trabalhamos com várias instituições financeiras para garantir-lhe as condições mais vantajosas, sempre com aconselhamento transparente e responsável.</p>', 'richtext', 'credit'),
('social_whatsapp', '351912345678', 'url', 'social'),
('hero_title', 'O seu parceiro de eleição em Imóveis e Seguros', 'text', 'homepage'),
('hero_subtitle', 'Encontre hoje a chave para o seu novo lar e a proteção para toda a família.', 'text', 'homepage'),
('hero_image', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 'image', 'homepage'),
('hero_cta_properties', 'Ver Imóveis', 'text', 'homepage'),
('hero_cta_insurance', 'Ver Seguros', 'text', 'homepage'),
('hero_cta_credit', 'Saber Mais', 'text', 'homepage');

-- 2. Initial Insurances
INSERT INTO insurances (name, slug, short_description, full_description, icon_name, status, display_order, form_fields) VALUES
(
  'Seguro Automóvel', 
  'seguro-automovel', 
  'A proteção ideal para viagens sempre seguras.', 
  '<p>O nosso seguro automóvel protege-o contra todos os imprevistos da estrada, com uma taxa super competitiva no mercado.</p>', 
  'car', 
  'active', 
  1,
  '[
    {"id": "nome", "type": "text", "label": "Nome Completo", "placeholder": "O seu nome", "required": true},
    {"id": "matricula", "type": "text", "label": "Matrícula do Veículo", "placeholder": "AA-00-AA", "required": true},
    {"id": "ano", "type": "number", "label": "Ano", "min": 1990, "max": 2026, "required": true},
    {"id": "cobertura", "type": "select", "label": "Cobertura Desejada", "options": ["Mínima (Terceiros)", "Intermédia", "Danos Próprios (Tudo Incluído)"], "required": true}
  ]'::jsonb
),
(
  'Seguro de Vida', 
  'seguro-vida', 
  'Apoio essencial para proteger quem mais ama.', 
  '<p>Proteja as pessoas que ama garantindo estabilidade financeira com os nossos pacotes de vida desenhados para todas as necessidades.</p>', 
  'heart_pulse', 
  'active', 
  2,
  '[
    {"id": "nome", "type": "text", "label": "Nome Completo", "placeholder": "O seu nome", "required": true},
    {"id": "idade", "type": "number", "label": "Idade", "min": 18, "max": 80, "required": true},
    {"id": "capital", "type": "number", "label": "Capital a Segurar (€)", "placeholder": "50000", "required": false}
  ]'::jsonb
),
(
  'Seguro Multirriscos Habitação', 
  'seguro-habitacao', 
  'Garante a máxima segurança para a sua nova casa.', 
  '<p>Este seguro cobre o seu imóvel contra incêndios, inundações e outros fenómenos, garantindo a salvaguarda de todo o seu recheio.</p>', 
  'home', 
  'active', 
  3,
  '[
    {"id": "nome", "type": "text", "label": "Nome Completo", "placeholder": "O seu nome", "required": true},
    {"id": "morada", "type": "text", "label": "Morada do Imóvel a Segurar", "placeholder": "Insira a morada", "required": true},
    {"id": "tipo", "type": "select", "label": "Tipo de Habitação", "options": ["Apartamento", "Moradia"], "required": true}
  ]'::jsonb
);

-- 3. Initial Demo Properties
INSERT INTO properties (id, title, slug, description, price, business_type, property_type, typology, area_m2, bedrooms, bathrooms, energy_certificate, district, municipality, tags, status, featured) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Moradia T4 de Luxo com Piscina', 
  'moradia-t4-luxo-piscina', 
  '<p>Incrível moradia T4 em excelente estado de conservação. Situada numa zona nobre da cidade, dispõe de 4 suítes e jardim murado.</p>', 
  650000.00, 
  'sale', 
  'house', 
  'T4', 
  280.00, 
  4, 
  5, 
  'A+', 
  'Porto', 
  'Matosinhos',
  ARRAY['Exclusivo', 'Novo'], 
  'active', 
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Apartamento T2 Centro Histórico', 
  'apartamento-t2-centro', 
  '<p>Fantástico T2 totalmente remodelado. Excelente exposição solar e proximidade a todos os serviços centrais. Ótimo para investimento.</p>', 
  220000.00, 
  'sale', 
  'apartment', 
  'T2', 
  85.00, 
  2, 
  1, 
  'C', 
  'Braga', 
  'Braga', 
  ARRAY['Baixa de Preço'], 
  'active', 
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Loja Comercial para Arrendar', 
  'loja-comercial-arrendar', 
  '<p>Espaço comercial amplo em grande rua movimentada. Ideal para serviços ou retalho. Instalações sanitárias e montra espaçosa.</p>', 
  1500.00, 
  'rent', 
  'commercial', 
  'T0', 
  150.00, 
  0, 
  2, 
  'B-', 
  'Lisboa', 
  'Lisboa', 
  ARRAY[]::TEXT[], 
  'active', 
  false
);

-- 4. Initial Demo Property Images
INSERT INTO property_images (property_id, url, alt_text, display_order) VALUES
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', 'Frente da Moradia', 0),
('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', 'Sala de Estar', 1),
('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1502672260266-1c1e5250ff16?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', 'Interior do Apartamento', 0),
('33333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', 'Interior da Loja Comercial', 0);
