-- Tabla de configuración global (depot, etc)
-- Ejecutar en Supabase -> SQL Editor

create table if not exists config (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

alter table config disable row level security;

-- Insertar depot vacío por defecto
insert into config (key, value) values ('depot', '{"name":"","address":"","lat":null,"lng":null}')
on conflict (key) do nothing;
