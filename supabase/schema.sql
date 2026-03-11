-- Drop tables if they exist to allow clean recreations during dev
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS insurances;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;

-- Users (Profiles linked to auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  business_type TEXT NOT NULL CHECK (business_type IN ('sale', 'rent')),
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'land', 'commercial', 'other')),
  typology TEXT NOT NULL,
  area_m2 DECIMAL(10,2) NOT NULL,
  bedrooms INT,
  bathrooms INT,
  energy_certificate TEXT NOT NULL,
  district TEXT NOT NULL,
  municipality TEXT NOT NULL,
  parish TEXT,
  address TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'suspended', 'draft')),
  featured BOOLEAN DEFAULT false,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Property Images
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insurances
CREATE TABLE insurances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_name TEXT,
  icon_url TEXT,
  cover_image_url TEXT,
  form_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site Settings (Dynamic Content)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  type TEXT NOT NULL CHECK (type IN ('text', 'richtext', 'image', 'url')),
  group_name TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads (Inbox)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'visit_request', 'insurance_simulation')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  form_data JSONB,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  insurance_id UUID REFERENCES insurances(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Note: In a real Supabase environment with RLS, the following would be active. 
-- For local development with standard Postgres, these won't do much without auth set up.
-- RLS Activation 
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE insurances ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_typology ON properties(typology);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_type ON leads(type);
