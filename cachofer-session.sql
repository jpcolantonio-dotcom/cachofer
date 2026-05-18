-- Columnas para detectar sesiones duplicadas
alter table drivers add column if not exists session_token text;
alter table drivers add column if not exists session_updated_at timestamptz;
