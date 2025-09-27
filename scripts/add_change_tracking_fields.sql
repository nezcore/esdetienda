-- Script para agregar campos de seguimiento de cambios a la tabla tenants
-- Ejecutar en Supabase SQL Editor

-- Agregar campos para rastrear últimos cambios de nombre y slug
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS last_name_change TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_slug_change TIMESTAMP WITH TIME ZONE;

-- Agregar comentarios para documentar los campos
COMMENT ON COLUMN tenants.last_name_change IS 'Timestamp del último cambio de business_name - restricción de 5 días entre cambios';
COMMENT ON COLUMN tenants.last_slug_change IS 'Timestamp del último cambio de slug - restricción de 5 días entre cambios';

-- Los valores NULL en estos campos significan que nunca se ha hecho un cambio
-- o que son cambios antiguos (antes de implementar esta restricción)
