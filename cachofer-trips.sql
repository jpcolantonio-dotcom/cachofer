-- Agregar número de viaje a las paradas
alter table stops add column if not exists trip_number int default 1;

-- Actualizar paradas existentes
update stops set trip_number = 1 where trip_number is null;
