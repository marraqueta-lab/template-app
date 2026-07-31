-- =====================================================================
-- template-app — esquema base (correr primero, una vez por proyecto)
-- Crea: empresas + perfiles (usuarios) con multi-empresa y RLS.
-- Luego corre el schema.sql de cada módulo de @marraqueta/ui-modules
-- que actives.
-- =====================================================================

create table if not exists empresas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  rut         text,
  activo      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Perfil de cada usuario, ligado a auth.users de Supabase.
create table if not exists perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  empresa_id  uuid references empresas(id) on delete set null,
  email       text not null,
  nombre      text not null default '',
  rol         text not null default 'operador',  -- admin | gestor | operador | solo_lectura
  activo      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists perfiles_empresa_idx on perfiles (empresa_id);

-- Al crear un usuario en Auth, se genera su perfil automáticamente.
-- `set search_path = ''` + referencias siempre calificadas con su schema:
-- sin esto, una función security definer puede ser secuestrada creando
-- un objeto con el mismo nombre en un schema anterior en el search_path.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'nombre', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS ------------------------------------------------------------------
alter table empresas enable row level security;
alter table perfiles enable row level security;

-- Cada usuario ve su propio perfil.
drop policy if exists "mi perfil" on perfiles;
create policy "mi perfil" on perfiles for select to authenticated
  using (id = auth.uid());

-- Cada usuario ve su empresa.
drop policy if exists "mi empresa" on empresas;
create policy "mi empresa" on empresas for select to authenticated
  using (
    id in (select empresa_id from perfiles where id = auth.uid())
  );

-- Permisos de tabla ----------------------------------------------------
-- La RLS filtra QUÉ filas se ven, pero primero el rol necesita permiso
-- sobre la tabla: sin esto la consulta muere con "permission denied" antes
-- de evaluar ninguna policy. No se hereda: las default privileges del rol
-- `postgres` en `public` solo otorgan TRUNCATE/REFERENCES/TRIGGER.
--
-- Solo SELECT, y solo a `authenticated`: no hay policy de INSERT ni UPDATE
-- en estas dos tablas a propósito. Crear empresas y asignar usuarios se
-- hace con supabase/provisionar.sql, no desde la app.
grant select on table empresas, perfiles to authenticated;
