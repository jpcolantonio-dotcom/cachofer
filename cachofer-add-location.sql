-- Agregar columna de ubicación en tiempo real a choferes
-- Ejecutar en Supabase -> SQL Editor

alter table drivers add column if not exists current_lat float;
alter table drivers add column if not exists current_lng float;
alter table drivers add column if not exists location_updated_at timestamptz;
