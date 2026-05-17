-- Actualizar coordenadas de clientes demo para que aparezcan en el mapa
-- Ejecutar en Supabase -> SQL Editor

update clients set lat=-34.6037, lng=-58.3816 where id='CL001';
update clients set lat=-34.5960, lng=-58.3930 where id='CL002';
update clients set lat=-34.6030, lng=-58.3738 where id='CL003';
update clients set lat=-34.6183, lng=-58.3927 where id='CL004';
update clients set lat=-34.6010, lng=-58.3920 where id='CL005';

-- Para tus clientes propios, editá cada uno desde
-- la app en Clientes -> editar -> poner lat y lng
-- Podés buscar las coordenadas en Google Maps:
-- clic derecho sobre la dirección -> "¿Qué hay aquí?" -> copiás lat,lng
