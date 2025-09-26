-- Migración para agregar campos de logo e icon a la tabla tenants
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar campos para personalización de logo
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7) DEFAULT '#134572',
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(7) DEFAULT '#27A3A4',
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);

-- Comentarios para documentar los campos
COMMENT ON COLUMN tenants.logo IS 'URL o base64 de la imagen de logo personalizada';
COMMENT ON COLUMN tenants.icon IS 'Emoji o icono seleccionado para la tienda';
COMMENT ON COLUMN tenants.description IS 'Descripción de la tienda';
COMMENT ON COLUMN tenants.primary_color IS 'Color primario de la tienda en formato hex';
COMMENT ON COLUMN tenants.secondary_color IS 'Color secundario de la tienda en formato hex';
COMMENT ON COLUMN tenants.whatsapp_number IS 'Número de WhatsApp para contacto';
