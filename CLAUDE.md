# CLAUDE.md

## Contexto del proyecto
[Completar al iniciar el proyecto real: qué hace la app, quién la usa]

## Stack
Next.js (App Router) + TypeScript, Tailwind + shadcn/ui, Supabase (Postgres + Auth + RLS), Vercel, GitHub.

## Convenciones
- Migraciones de Supabase como código (`supabase migration new`), nunca desde el dashboard.
- Componentes de shadcn se agregan con `npx shadcn@latest add <componente>`, no se escriben a mano si ya existen.
- Testing: Vitest, tests junto al archivo que testean (`archivo.ts` → `archivo.test.ts` al lado).

## Base común (`core/`)
`core/` trae auth, sesión, multi-empresa y los clientes de Supabase — lo
que toda app necesita desde el día uno. No se toca salvo bug o necesidad
real del proyecto. Antes de escribir una acción que mute datos, revisa
`core/auth/session.ts` (`getPerfil()`) y `core/auth/roles.ts` (`puede()`):
todo Server Action que crea, edita o elimina debe verificar el permiso en
el servidor — no basta con esconder el botón en la UI.

## Cómo se arma una app de cliente

Esta app la ensamblamos nosotros (Gino o Tomás), no el cliente: él recibe
la app funcionando y nunca ve el repo ni Supabase. El punto de partida
típico es "el cliente X necesita los módulos A, B y C".

**Antes de escribir un componente de negocio desde cero** (clientes,
pedidos, inventario, lo que sea), revisa si ya existe en
[`@marraqueta/ui-modules`](https://github.com/marraqueta-lab/ui-modules).
Si existe, se monta — no se reescribe.

### Montar un módulo

1. **Instalar la biblioteca** fijando el tag, nunca `main`:
   `"@marraqueta/ui-modules": "github:marraqueta-lab/ui-modules#v0.2.0"`

2. **Resolver dependencias.** Varios módulos requieren otros por foreign
   key, y el `schema.sql` falla si el requisito no está. El README de
   `ui-modules` tiene la tabla; en corto: `compras` y `stock` necesitan
   `ingredientes`; `recetas` necesita `productos` + `ingredientes`;
   `pedidos` necesita `clientes` + `productos`.

3. **Correr los `schema.sql`** en Supabase en ese orden de dependencia,
   después del esquema base de `supabase/migrations/`.

4. **Crear la ruta** en `app/(dashboard)/<slug>/page.tsx`. El README de
   cada módulo trae el snippet exacto de cómo montarlo.

5. **Registrar en la navegación**: agregar la entrada en
   `core/navegacion.ts` con su ícono de Lucide. La barra lateral se arma
   sola desde ahí.

### Si el cliente pide algo que no existe en la biblioteca

Se construye en este repo, siguiendo el mismo contrato que usan los
módulos (`schema.sql` con `empresa_id` + RLS, acceso a datos en servidor,
permisos verificados en cada Server Action). **No se copia un módulo de
otro cliente para adaptarlo** — si se necesita algo parecido a lo que
tiene otro, se avisa para evaluar si corresponde graduarlo a la
biblioteca. Copiar y adaptar es justo lo que la biblioteca existe para
evitar.

## Bitácora de sesión
Al cerrar cada sesión de trabajo, usar el skill `project-log` para generar o
actualizar PROJECT_LOG.md con el estado del proyecto.

## Diseño
Ver DESIGN.md para paleta, tipografía y pantallas clave.