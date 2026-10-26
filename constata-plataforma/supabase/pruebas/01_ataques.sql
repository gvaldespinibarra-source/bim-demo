-- =====================================================================
-- Pruebas de seguridad del expediente.
-- Cada prueba intenta algo que NO debe poder hacerse. Si alguna lo logra,
-- el script se detiene con "FALLA DE SEGURIDAD".
-- Datos 100 % ficticios.
-- =====================================================================
\set ON_ERROR_STOP 1
\set QUIET 1
set client_min_messages = notice;

-- Ayudantes --------------------------------------------------------------
create schema pruebas;
grant usage on schema pruebas to anon, authenticated, service_role;

create function pruebas.debe_fallar(sentencia text, que text) returns void
language plpgsql as $$
begin
  begin
    execute sentencia;
  exception when others then
    raise notice '  ✓ %  [bloqueado: %]', que, sqlerrm;
    return;
  end;
  raise exception 'FALLA DE SEGURIDAD: %', que;
end;
$$;

create function pruebas.cuenta(consulta text) returns bigint
language plpgsql as $$
declare n bigint;
begin
  execute 'select count(*) from (' || consulta || ') x' into n;
  return n;
end;
$$;

create function pruebas.igual(obtenido bigint, esperado bigint, que text) returns void
language plpgsql as $$
begin
  if obtenido is distinct from esperado then
    raise exception 'FALLA DE SEGURIDAD: % (esperado %, obtenido %)', que, esperado, obtenido;
  end if;
  raise notice '  ✓ %', que;
end;
$$;

create function pruebas.sin_efecto(sentencia text, que text) returns void
language plpgsql as $$
declare n bigint;
begin
  execute sentencia;
  get diagnostics n = row_count;
  perform pruebas.igual(n, 0, que);
end;
$$;

create function pruebas.como(usuario text) returns void
language sql as $$ select set_config('request.jwt.claim.sub', usuario, false) $$;

grant execute on all functions in schema pruebas to anon, authenticated, service_role;

-- Personas y empresas ficticias -------------------------------------------
insert into auth.users (id, email) values
  ('d0000000-0000-0000-0000-000000000001', 'director@constata.test'),
  ('c0000000-0000-0000-0000-000000000001', 'comercial@constata.test'),
  ('e1000000-0000-0000-0000-000000000001', 'rh@empresa-uno.test'),
  ('e2000000-0000-0000-0000-000000000001', 'rh@empresa-dos.test');

insert into public.empresas (id, razon_social) values
  ('a1000000-0000-0000-0000-000000000001', 'Logística Ficticia'),
  ('a2000000-0000-0000-0000-000000000001', 'Retail Ficticio');

insert into public.perfiles (id, rol, empresa_id, nombre) values
  ('d0000000-0000-0000-0000-000000000001', 'director', null, 'Director'),
  ('c0000000-0000-0000-0000-000000000001', 'comercial', null, 'Socia comercial'),
  ('e1000000-0000-0000-0000-000000000001', 'empresa', 'a1000000-0000-0000-0000-000000000001', 'RH Uno'),
  ('e2000000-0000-0000-0000-000000000001', 'empresa', 'a2000000-0000-0000-0000-000000000001', 'RH Dos');

\echo
\echo '1. Visitante sin sesión'
set role anon;
select pruebas.debe_fallar('select * from public.estudios', 'No puede leer estudios');
select pruebas.debe_fallar('select * from public.empresas', 'No puede leer empresas');
select pruebas.debe_fallar($$insert into public.solicitudes_contacto (nombre, empresa, correo) values ('x','x','x@x.co')$$,
  'No puede escribir directo en la base (el formulario pasa por el servidor)');
reset role;

\echo
\echo '2. Empresa Uno solicita un estudio'
set role authenticated;
select pruebas.como('e1000000-0000-0000-0000-000000000001');
insert into public.estudios (id, empresa_id, puesto, paquete) values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Supervisor de almacén', 'videovisita'),
  ('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Contador', 'profesional');
insert into public.candidatos (estudio_id, nombre, correo) values
  ('b1000000-0000-0000-0000-000000000001', 'María López Ficticia', 'maria@prueba.test');
\echo '  ✓ Puede solicitar estudios y registrar a su candidato'
select pruebas.debe_fallar($$insert into public.estudios (empresa_id, puesto, paquete) values ('a2000000-0000-0000-0000-000000000001', 'Cajero', 'basico')$$,
  'No puede pedir un estudio a nombre de otra empresa');
select pruebas.debe_fallar($$insert into public.estudios (empresa_id, puesto, paquete, estado) values ('a1000000-0000-0000-0000-000000000001', 'Cajero', 'basico', 'entregado')$$,
  'Un estudio no puede nacer ya entregado');
select pruebas.sin_efecto($$update public.estudios set estado = 'esperando_candidato' where id = 'b1000000-0000-0000-0000-000000000001'$$,
  'No puede avanzar el estado de su propio estudio');
select pruebas.sin_efecto($$update public.perfiles set rol = 'director' where id = 'e1000000-0000-0000-0000-000000000001'$$,
  'No puede ascenderse a director');
select pruebas.debe_fallar($$insert into public.perfiles (id, rol, nombre) values ('e1000000-0000-0000-0000-000000000001', 'director', 'yo')$$,
  'No puede crearse un perfil de personal');
select pruebas.igual(pruebas.cuenta('select * from public.perfiles'), 1, 'Solo ve su propio perfil');
select pruebas.igual(pruebas.cuenta('select * from public.bitacora'), 0, 'No puede leer la bitácora');
select pruebas.igual(pruebas.cuenta('select * from public.solicitudes_contacto'), 0, 'No ve solicitudes de contacto');

\echo
\echo '3. Empresa Dos intenta ver lo de Empresa Uno'
select pruebas.como('e2000000-0000-0000-0000-000000000001');
select pruebas.igual(pruebas.cuenta('select * from public.estudios'), 0, 'No ve estudios ajenos');
select pruebas.igual(pruebas.cuenta('select * from public.candidatos'), 0, 'No ve candidatos ajenos');
select pruebas.igual(pruebas.cuenta('select * from public.empresas'), 1, 'Solo ve su propia empresa');
select pruebas.sin_efecto($$update public.estudios set puesto = 'hackeado'$$, 'No puede modificar estudios ajenos');
select pruebas.sin_efecto($$delete from public.estudios$$, 'No puede borrar estudios ajenos');
select pruebas.debe_fallar($$insert into public.candidatos (estudio_id, nombre, correo) values ('b2000000-0000-0000-0000-000000000001', 'Intruso', 'x@x.co')$$,
  'No puede meter un candidato en un estudio ajeno');
select pruebas.debe_fallar($$select public.registrar_consulta('b1000000-0000-0000-0000-000000000001')$$,
  'No puede consultar un expediente ajeno');

\echo
\echo '4. Socia comercial avanza el estudio, pero no puede entregar'
select pruebas.como('c0000000-0000-0000-0000-000000000001');
update public.estudios set estado = 'esperando_candidato' where id = 'b1000000-0000-0000-0000-000000000001';
update public.estudios set estado = 'en_captura' where id = 'b1000000-0000-0000-0000-000000000001';
update public.estudios set estado = 'en_verificacion' where id = 'b1000000-0000-0000-0000-000000000001';
insert into public.rubros (estudio_id, rubro, estatus, detalle, fuente) values
  ('b1000000-0000-0000-0000-000000000001', 'Identidad y CURP', 'verificado', 'Coincide con la consulta pública', 'RENAPO'),
  ('b1000000-0000-0000-0000-000000000001', 'Historial laboral', 'discrepancia', 'Fecha de salida difiere', 'IMSS');
update public.estudios set estado = 'en_revision' where id = 'b1000000-0000-0000-0000-000000000001';
\echo '  ✓ Puede avanzar los pasos normales y capturar resultados'
select pruebas.debe_fallar($$update public.estudios set estado = 'entregado', huella_informe = repeat('a', 64) where id = 'b1000000-0000-0000-0000-000000000001'$$,
  'No puede entregar un informe (solo el director)');

\echo
\echo '5. Empresa Uno espera su informe'
select pruebas.como('e1000000-0000-0000-0000-000000000001');
select pruebas.igual(pruebas.cuenta('select * from public.rubros'), 0, 'No ve resultados antes de la aprobación humana');

\echo
\echo '6. Un proceso automático (llave de servidor) intenta entregar'
reset role;
set role service_role;
select pruebas.como('');
select pruebas.debe_fallar($$update public.estudios set estado = 'entregado', huella_informe = repeat('a', 64) where id = 'b1000000-0000-0000-0000-000000000001'$$,
  'Ni un motor ni la IA pueden entregar sin el director');
reset role;

\echo
\echo '7. Director'
set role authenticated;
select pruebas.como('d0000000-0000-0000-0000-000000000001');
select pruebas.debe_fallar($$update public.estudios set estado = 'entregado', huella_informe = repeat('a', 64) where id = 'b2000000-0000-0000-0000-000000000001'$$,
  'No se puede saltar pasos (solicitado → entregado)');
select pruebas.debe_fallar($$update public.estudios set empresa_id = 'a2000000-0000-0000-0000-000000000001' where id = 'b2000000-0000-0000-0000-000000000001'$$,
  'Un estudio no se puede pasar a otra empresa');
select pruebas.debe_fallar($$update public.estudios set estado = 'entregado' where id = 'b1000000-0000-0000-0000-000000000001'$$,
  'No se entrega sin huella del informe');
update public.estudios set estado = 'entregado', huella_informe = repeat('a', 64)
  where id = 'b1000000-0000-0000-0000-000000000001';
\echo '  ✓ El director aprueba y entrega'
select pruebas.igual((pruebas.cuenta('select * from public.bitacora') > 10)::int, 1, 'El director puede leer la bitácora');

\echo
\echo '8. Empresa Uno recibe su informe'
select pruebas.como('e1000000-0000-0000-0000-000000000001');
select pruebas.igual(pruebas.cuenta('select * from public.rubros'), 2, 'Ahora sí ve los resultados aprobados');
select public.registrar_consulta('b1000000-0000-0000-0000-000000000001');
\echo '  ✓ Su consulta queda registrada'
reset role;

\echo
\echo '9. Nadie puede alterar la bitácora'
set role authenticated;
select pruebas.como('d0000000-0000-0000-0000-000000000001');
select pruebas.debe_fallar('update public.bitacora set accion = $$x$$', 'El director no puede editarla');
select pruebas.debe_fallar('delete from public.bitacora', 'El director no puede borrarla');
reset role;
set role service_role;
select pruebas.debe_fallar('delete from public.bitacora', 'El servidor no puede borrarla');
select pruebas.debe_fallar($$insert into public.bitacora (accion, tabla) values ('falsa', 'estudios')$$, 'El servidor no puede inventar entradas');
reset role;
select pruebas.debe_fallar('delete from public.bitacora', 'Ni el administrador de la base puede borrarla');
select pruebas.debe_fallar('truncate public.bitacora', 'Ni vaciarla');
select pruebas.igual((select count(*) from public.bitacora b where b::text ilike '%María%' or b::text ilike '%maria@%'), 0,
  'La bitácora no guarda datos personales');
select pruebas.igual((select count(*) from public.bitacora where accion = 'consulta'), 1, 'La consulta de la empresa quedó registrada');

\echo
\echo '10. Borrado a los 6 meses (lo ejecuta el motor de borrado)'
set role service_role;
update public.estudios set estado = 'borrado' where id = 'b1000000-0000-0000-0000-000000000001';
reset role;
select pruebas.igual((select count(*) from public.candidatos where estudio_id = 'b1000000-0000-0000-0000-000000000001'), 0, 'Se borraron los datos del candidato');
select pruebas.igual((select count(*) from public.rubros where estudio_id = 'b1000000-0000-0000-0000-000000000001'), 0, 'Se borraron los resultados');
select pruebas.igual((select count(*) from public.estudios where id = 'b1000000-0000-0000-0000-000000000001' and huella_informe is not null), 1,
  'Se conservan folio y huella para demostrar integridad');

\echo
\echo 'Todas las pruebas pasaron.'
