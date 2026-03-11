-- Bucket de Imagens dos Imóveis
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Qualquer pessoa pode ver as imagens (necessário para o site público)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-images');

-- Política: Qualquer utilizador autenticado pode fazer upload (Admin)
-- Nota: Para simplificar este MVP sem RLS restrito, permitimos uploads gerais à pasta
CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow Updates" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'property-images');

CREATE POLICY "Allow Deletes" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'property-images');

-- Bucket para Assets do Site (Hero, Sobre Nós, etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access - site-assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-assets');

CREATE POLICY "Allow Uploads - site-assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Allow Updates - site-assets" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'site-assets');

CREATE POLICY "Allow Deletes - site-assets" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'site-assets');
