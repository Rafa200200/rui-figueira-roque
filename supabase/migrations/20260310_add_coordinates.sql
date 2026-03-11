-- Adicionar colunas de latitude e longitude à tabela de imóveis
ALTER TABLE properties 
ADD COLUMN latitude DECIMAL(9,6),
ADD COLUMN longitude DECIMAL(9,6);

-- Comentário para clareza
COMMENT ON COLUMN properties.latitude IS 'Latitude para localização aproximada no mapa';
COMMENT ON COLUMN properties.longitude IS 'Longitude para localização aproximada no mapa';
