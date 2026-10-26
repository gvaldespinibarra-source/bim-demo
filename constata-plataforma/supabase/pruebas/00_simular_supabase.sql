-- Simula lo mínimo de Supabase para probar la base en una computadora sin Supabase:
-- el esquema auth, la función auth.uid() y los roles anon / authenticated / service_role
-- con los mismos permisos por omisión que Supabase les da.
-- NO se ejecuta en Supabase real (allí ya existe todo esto).

create schema auth;
create table auth.users (id uuid primary key, email text);

create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

-- Los roles son de todo el servidor: se crean solo si no existen de una corrida anterior.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end
$$;

grant usage on schema public, auth to anon, authenticated, service_role;
grant execute on function auth.uid() to public;

-- Igual que Supabase: todo lo nuevo en public queda abierto a los tres roles
-- y son las políticas RLS las que deciden. Así la prueba es realista.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
