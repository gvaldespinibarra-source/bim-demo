-- =====================================================================
-- CONSTATA · Cimiento: el expediente común
--
-- Todas las mini apps leen y escriben aquí. Las reglas de seguridad viven
-- en la base de datos, no en las pantallas: aunque una pantalla tenga un
-- error, la base no entrega datos de una empresa a otra.
--
-- Contenido:
--   1. Tipos (roles, estados, paquetes)
--   2. Tablas
--   3. Funciones de apoyo para permisos
--   4. Reglas del ciclo del estudio (qué paso sigue a cuál y quién lo da)
--   5. Bitácora inmodificable
--   6. Permisos por fila (RLS)
-- =====================================================================

-- 1. Tipos ------------------------------------------------------------

create type public.rol_usuario as enum ('director', 'comercial', 'empresa');

create type public.estado_estudio as enum (
  'solicitado',           -- la empresa lo pidió
  'esperando_candidato',  -- se envió la liga al candidato
  'en_captura',           -- el candidato firmó y está capturando
  'en_verificacion',      -- se están verificando fuentes
  'en_revision',          -- borrador listo, espera aprobación humana
  'entregado',            -- aprobado por el director y disponible para la empresa
  'cancelado',            -- detenido (p. ej. el candidato revocó su consentimiento)
  'borrado'               -- datos personales eliminados; queda solo el folio y la huella
);

create type public.paquete_estudio as enum ('basico', 'profesional', 'videovisita', 'presencial');

create type public.estatus_rubro as enum ('pendiente', 'verificado', 'discrepancia', 'no_verificable');

-- 2. Tablas -----------------------------------------------------------

create table public.empresas (
  id uuid primary key default gen_random_uuid(),
  razon_social text not null check (length(razon_social) between 2 and 200),
  rfc text check (rfc ~ '^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$'),
  creada_en timestamptz not null default now()
);

-- Un perfil por usuario del sistema de inicio de sesión. Los candidatos NO tienen
-- perfil: entran con una liga única y la atiende el servidor.
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rol public.rol_usuario not null,
  empresa_id uuid references public.empresas (id),
  nombre text not null,
  creado_en timestamptz not null default now(),
  -- Un usuario de empresa siempre pertenece a una; el personal de CONSTATA a ninguna.
  check ((rol = 'empresa') = (empresa_id is not null))
);

create sequence public.folio_estudio;

create table public.estudios (
  id uuid primary key default gen_random_uuid(),
  folio text not null unique
    default 'CST-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.folio_estudio')::text, 5, '0'),
  empresa_id uuid not null references public.empresas (id),
  solicitado_por uuid references auth.users (id) default auth.uid(),
  puesto text not null check (length(puesto) between 2 and 120),
  paquete public.paquete_estudio not null,
  estado public.estado_estudio not null default 'solicitado',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  entregado_en timestamptz,
  aprobado_por uuid references auth.users (id),
  -- Huella SHA-256 del informe aprobado: sobrevive al borrado para demostrar integridad.
  huella_informe text check (huella_informe ~ '^[0-9a-f]{64}$'),
  borrar_despues_de timestamptz
);

create index on public.estudios (empresa_id);
create index on public.estudios (estado);

-- Datos de contacto del candidato. Se eliminan al borrar el estudio.
create table public.candidatos (
  estudio_id uuid primary key references public.estudios (id) on delete cascade,
  nombre text not null check (length(nombre) between 2 and 160),
  correo text check (correo ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  telefono text check (telefono ~ '^\+?[0-9 ]{10,16}$'),
  check (correo is not null or telefono is not null)
);

-- Cada rubro verificado del informe (identidad, domicilio, historial...).
create table public.rubros (
  id uuid primary key default gen_random_uuid(),
  estudio_id uuid not null references public.estudios (id) on delete cascade,
  rubro text not null,
  estatus public.estatus_rubro not null default 'pendiente',
  detalle text,
  fuente text,
  actualizado_en timestamptz not null default now(),
  unique (estudio_id, rubro)
);

-- Solicitudes de prueba piloto que llegan del sitio público.
create table public.solicitudes_contacto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text not null,
  correo text not null,
  volumen text,
  atendida boolean not null default false,
  recibida_en timestamptz not null default now()
);

-- 3. Funciones de apoyo -----------------------------------------------
-- "security definer" les permite leer perfiles sin abrir esa tabla a todos.

create function public.mi_rol() returns public.rol_usuario
language sql stable security definer set search_path = '' as $$
  select rol from public.perfiles where id = auth.uid()
$$;

create function public.mi_empresa() returns uuid
language sql stable security definer set search_path = '' as $$
  select empresa_id from public.perfiles where id = auth.uid()
$$;

create function public.es_personal() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.mi_rol() in ('director', 'comercial'), false)
$$;

-- 4. Ciclo del estudio ------------------------------------------------
-- Solo se permiten los pasos de esta tabla. Entregar requiere al director:
-- ni la socia comercial, ni un motor automático, ni la IA pueden entregar.

create function public.validar_estado() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  permitido boolean;
begin
  if tg_op = 'INSERT' then
    if new.estado <> 'solicitado' then
      raise exception 'Un estudio nuevo empieza en "solicitado"';
    end if;
    return new;
  end if;

  -- Campos que nunca cambian una vez creados.
  if new.empresa_id <> old.empresa_id or new.folio <> old.folio then
    raise exception 'La empresa y el folio de un estudio no se pueden cambiar';
  end if;

  new.actualizado_en := now();
  if new.estado = old.estado then
    return new;
  end if;

  permitido := case old.estado
    when 'solicitado'          then new.estado in ('esperando_candidato', 'cancelado')
    when 'esperando_candidato' then new.estado in ('en_captura', 'cancelado')
    when 'en_captura'          then new.estado in ('en_verificacion', 'cancelado')
    when 'en_verificacion'     then new.estado in ('en_revision', 'cancelado')
    when 'en_revision'         then new.estado in ('entregado', 'en_verificacion', 'cancelado')
    when 'entregado'           then new.estado = 'borrado'
    when 'cancelado'           then new.estado = 'borrado'
    else false
  end;
  if not permitido then
    raise exception 'Paso no permitido: % → %', old.estado, new.estado;
  end if;

  if new.estado = 'entregado' then
    if public.mi_rol() is distinct from 'director' then
      raise exception 'Solo el director puede aprobar y entregar un informe';
    end if;
    if new.huella_informe is null then
      raise exception 'No se puede entregar sin la huella del informe aprobado';
    end if;
    new.entregado_en := now();
    new.aprobado_por := auth.uid();
    new.borrar_despues_de := now() + interval '6 months';
  end if;

  if new.estado = 'cancelado' then
    new.borrar_despues_de := now() + interval '6 months';
  end if;

  -- Borrado: se eliminan los datos personales y los resultados; quedan folio,
  -- fechas y huella del informe.
  if new.estado = 'borrado' then
    delete from public.candidatos where estudio_id = new.id;
    delete from public.rubros where estudio_id = new.id;
  end if;

  return new;
end;
$$;

create trigger estudios_validar_estado
  before insert or update on public.estudios
  for each row execute function public.validar_estado();

-- 5. Bitácora inmodificable --------------------------------------------
-- La escribe la propia base de datos con cada cambio; ninguna pantalla puede
-- saltársela. Guarda QUÉ columnas cambiaron, nunca sus valores, para no
-- conservar datos personales más allá del borrado.

create table public.bitacora (
  id bigint generated always as identity primary key,
  ocurrido_en timestamptz not null default now(),
  usuario_id uuid,          -- null = proceso automático del servidor
  rol text,
  accion text not null,     -- alta, cambio, baja, consulta
  tabla text not null,
  registro_id uuid,
  estado_nuevo text,
  columnas text[]
);

create index on public.bitacora (registro_id);

create function public.registrar_cambio() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  fila jsonb := to_jsonb(coalesce(new, old));
  columnas text[];
begin
  if tg_op = 'UPDATE' then
    select array_agg(n.key order by n.key) into columnas
    from jsonb_each(to_jsonb(new)) n
    where n.value is distinct from (to_jsonb(old) -> n.key);
  else
    select array_agg(k order by k) into columnas from jsonb_object_keys(fila) k;
  end if;

  insert into public.bitacora (usuario_id, rol, accion, tabla, registro_id, estado_nuevo, columnas)
  values (
    auth.uid(),
    coalesce(public.mi_rol()::text, current_user),
    case tg_op when 'INSERT' then 'alta' when 'UPDATE' then 'cambio' else 'baja' end,
    tg_table_name,
    coalesce((fila ->> 'id')::uuid, (fila ->> 'estudio_id')::uuid),
    case when tg_table_name = 'estudios' and tg_op <> 'DELETE' then fila ->> 'estado' end,
    columnas
  );
  return null;
end;
$$;

create trigger bitacora_empresas after insert or update or delete on public.empresas
  for each row execute function public.registrar_cambio();
create trigger bitacora_perfiles after insert or update or delete on public.perfiles
  for each row execute function public.registrar_cambio();
create trigger bitacora_estudios after insert or update or delete on public.estudios
  for each row execute function public.registrar_cambio();
create trigger bitacora_candidatos after insert or update or delete on public.candidatos
  for each row execute function public.registrar_cambio();
create trigger bitacora_rubros after insert or update or delete on public.rubros
  for each row execute function public.registrar_cambio();

-- Nadie modifica ni borra la bitácora, ni siquiera el servidor.
create function public.bitacora_inmodificable() returns trigger
language plpgsql as $$
begin
  raise exception 'La bitácora no se puede modificar ni borrar';
end;
$$;

create trigger bitacora_sin_cambios before update or delete or truncate on public.bitacora
  for each statement execute function public.bitacora_inmodificable();

-- Las lecturas no disparan triggers: las pantallas que muestran un expediente
-- llaman a esta función para dejar constancia de la consulta.
create function public.registrar_consulta(estudio uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.estudios e
    where e.id = estudio and (public.es_personal() or e.empresa_id = public.mi_empresa())
  ) then
    raise exception 'Sin acceso a ese estudio';
  end if;
  insert into public.bitacora (usuario_id, rol, accion, tabla, registro_id)
  values (auth.uid(), public.mi_rol()::text, 'consulta', 'estudios', estudio);
end;
$$;

-- 6. Permisos por fila (RLS) -------------------------------------------
-- Regla general: sin una política que lo permita, no se ve ni se cambia nada.

alter table public.empresas enable row level security;
alter table public.perfiles enable row level security;
alter table public.estudios enable row level security;
alter table public.candidatos enable row level security;
alter table public.rubros enable row level security;
alter table public.solicitudes_contacto enable row level security;
alter table public.bitacora enable row level security;

-- Visitantes sin sesión: nada.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
-- La bitácora solo admite escrituras de sus propios triggers.
revoke insert, update, delete, truncate on public.bitacora from authenticated, service_role;
-- Las funciones de apoyo no se exponen a visitantes.
revoke execute on all functions in schema public from public, anon;
grant execute on function public.mi_rol(), public.mi_empresa(), public.es_personal(),
  public.registrar_consulta(uuid) to authenticated;

-- Empresas: el personal ve y administra todas; cada usuario de empresa ve la suya.
create policy empresas_ver on public.empresas for select to authenticated
  using (public.es_personal() or id = public.mi_empresa());
create policy empresas_alta on public.empresas for insert to authenticated
  with check (public.es_personal());
create policy empresas_cambio on public.empresas for update to authenticated
  using (public.es_personal()) with check (public.es_personal());

-- Perfiles: cada quien ve el suyo; el personal ve todos. Las altas las hace el
-- servidor (mini app comercial), nunca el propio usuario.
create policy perfiles_ver on public.perfiles for select to authenticated
  using (id = auth.uid() or public.es_personal());

-- Estudios: la empresa ve y solicita los suyos; solo el personal cambia su estado.
create policy estudios_ver on public.estudios for select to authenticated
  using (public.es_personal() or empresa_id = public.mi_empresa());
create policy estudios_solicitar on public.estudios for insert to authenticated
  with check (public.mi_rol() = 'empresa' and empresa_id = public.mi_empresa());
create policy estudios_avanzar on public.estudios for update to authenticated
  using (public.es_personal()) with check (public.es_personal());

-- Candidatos: la empresa registra al candidato de su propio estudio recién solicitado.
create policy candidatos_ver on public.candidatos for select to authenticated
  using (
    public.es_personal()
    or exists (select 1 from public.estudios e
               where e.id = estudio_id and e.empresa_id = public.mi_empresa())
  );
create policy candidatos_alta on public.candidatos for insert to authenticated
  with check (
    exists (select 1 from public.estudios e
            where e.id = estudio_id and e.empresa_id = public.mi_empresa()
              and e.estado = 'solicitado')
  );

-- Rubros: los escribe el personal (o los motores con la llave de servidor).
-- La empresa solo los ve cuando el director ya entregó el informe.
create policy rubros_ver on public.rubros for select to authenticated
  using (
    public.es_personal()
    or exists (select 1 from public.estudios e
               where e.id = estudio_id and e.empresa_id = public.mi_empresa()
                 and e.estado = 'entregado')
  );
create policy rubros_escribir on public.rubros for all to authenticated
  using (public.es_personal()) with check (public.es_personal());

-- Solicitudes de contacto: las inserta el servidor del sitio; las ve el personal.
create policy contacto_ver on public.solicitudes_contacto for select to authenticated
  using (public.es_personal());
create policy contacto_atender on public.solicitudes_contacto for update to authenticated
  using (public.es_personal()) with check (public.es_personal());

-- Bitácora: solo la consulta el director.
create policy bitacora_ver on public.bitacora for select to authenticated
  using (public.mi_rol() = 'director');
