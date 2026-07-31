-- =====================================================================
-- Aprovisionamiento inicial del cliente
--
-- Se corre UNA VEZ, a mano, en el SQL Editor de Supabase, después de las
-- migraciones. No es una migración: crea datos de este cliente concreto,
-- no estructura.
--
-- Por qué a mano y no desde la app: no existe policy de INSERT en
-- `empresas` ni de UPDATE en `perfiles`, a propósito. Si un usuario
-- pudiera crear su empresa o cambiarse de empresa, podría salirse del
-- aislamiento que da la RLS. El alta la hacemos nosotros.
-- =====================================================================


-- ── 1. La empresa ────────────────────────────────────────────────────
-- En esta arquitectura cada cliente tiene su propio proyecto de Supabase,
-- así que normalmente hay UNA empresa acá. La tabla admite varias para el
-- caso de un cliente con más de una razón social.

insert into empresas (nombre, rut)
values ('NOMBRE DEL CLIENTE', '11.111.111-1')
on conflict do nothing;


-- ── 2. Los usuarios ──────────────────────────────────────────────────
-- Crear cada usuario primero en Authentication > Users del dashboard (o
-- por invitación). El trigger `handle_new_user` les arma el perfil con
-- rol 'operador' y sin empresa; esto los asigna y les fija el rol real.
--
-- Roles: admin | gestor | operador | solo_lectura
-- (ver core/auth/roles.ts para qué puede hacer cada uno)

update perfiles p
set empresa_id = (select id from empresas order by created_at limit 1),
    rol        = 'admin',
    nombre     = 'Nombre Apellido'
where p.email = 'persona@cliente.cl';

-- Repetir el update por cada usuario, cambiando email, rol y nombre.


-- ── 3. Verificación ──────────────────────────────────────────────────
-- Toda fila debe tener empresa. Si alguna sale con empresa_id nulo, esa
-- persona va a ver la pantalla de "cuenta sin configurar".

select p.email, p.nombre, p.rol, e.nombre as empresa
from perfiles p
left join empresas e on e.id = p.empresa_id
order by p.created_at;


-- ── Antes de entregar ────────────────────────────────────────────────
-- En Authentication > Providers, desactivar el registro público
-- ("Allow new users to sign up"). Si queda abierto, cualquiera puede
-- crearse una cuenta: no vería datos —queda sin empresa y la RLS lo
-- filtra— pero igual no corresponde que se registre solo.
