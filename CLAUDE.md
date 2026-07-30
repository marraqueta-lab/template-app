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

## Módulos (`ui-modules`)
Antes de construir un componente de negocio desde cero (clientes, pedidos,
inventario, lo que sea), revisa si ya existe en
[`@marraqueta/ui-modules`](https://github.com/marraqueta-lab/ui-modules).
Si existe, se instala su `schema.sql` y se importa — no se reescribe. Si
no existe pero se parece a algo de otro cliente, no se copia intuición:
se avisa para evaluar si corresponde graduarlo a la biblioteca.

## Bitácora de sesión
Al cerrar cada sesión de trabajo, usar el skill `project-log` para generar o
actualizar PROJECT_LOG.md con el estado del proyecto.

## Diseño
Ver DESIGN.md para paleta, tipografía y pantallas clave.