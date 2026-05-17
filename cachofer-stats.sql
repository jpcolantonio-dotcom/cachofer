-- Agregar columnas para estadísticas de tiempo en paradas
-- Ejecutar en Supabase -> SQL Editor

alter table stops add column if not exists arrived_at timestamptz;
alter table stops add column if not exists departure_at timestamptz;
alter table stops add column if not exists time_at_stop_minutes float;

-- Vista de estadísticas por chofer/parada
create or replace view stop_stats as
select 
  s.id,
  s.work_date,
  s.driver_id,
  d.name as driver_name,
  s.client_id,
  c.name as client_name,
  c.address,
  s.priority,
  s.status,
  s.arrived_at,
  s.delivered_at,
  s.departure_at,
  s.time_at_stop_minutes,
  case 
    when s.arrived_at is not null and s.delivered_at is not null 
    then round(extract(epoch from (s.delivered_at - s.arrived_at))/60, 1)
    else null 
  end as wait_minutes,
  case
    when s.arrived_at is not null and s.departure_at is not null
    then round(extract(epoch from (s.departure_at - s.arrived_at))/60, 1)
    else null
  end as total_stop_minutes
from stops s
left join drivers d on d.id = s.driver_id
left join clients c on c.id = s.client_id
order by s.work_date desc, s.arrived_at asc;
