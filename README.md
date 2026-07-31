# template-app

Plantilla base de Marraqueta Lab para apps de cliente nuevas. Trae la base
común (`core/`): auth, sesión, multi-empresa con RLS y protección de rutas.

## Al usar este template para un proyecto nuevo

### 1. Crear el repo

1. Repo nuevo desde **"Use this template"** en GitHub — nunca clonar
   `template-app` directo. **Privado**: los repos de cliente no van públicos.
2. Cambiar `"name"` en `package.json` (no dejar el nombre del template — ya
   te pasó una vez) **y `project_id` en `supabase/config.toml`**. Ese
   segundo es fácil de pasar por alto: si queda en `template-app`, los
   contenedores locales de esta app colisionan con los de cualquier otra
   —`supabase start` acá levanta contenedores con el nombre del otro
   proyecto— y terminas aplicando esquemas en la base equivocada.

### 2. Supabase

3. Crear un **proyecto de Supabase propio para este cliente**. Uno por app:
   base de datos separada, nunca compartida entre clientes.
4. Correr `supabase/migrations/` — el esquema base crea `empresas` y
   `perfiles` con su RLS.
5. Copiar `.env.example` a `.env.local` con las claves reales. Nunca
   commitear `.env.local`.
6. **Aprovisionar**: crear los usuarios en Authentication > Users, y correr
   [`supabase/provisionar.sql`](supabase/provisionar.sql) para crear la
   empresa y asignárselas. Sin esto, quien entre ve "cuenta sin
   configurar" — no hay alta desde la app, es deliberado.

### 3. Módulos

7. Elegir de [`@marraqueta/ui-modules`](https://github.com/marraqueta-lab/ui-modules)
   los módulos que el cliente contrató, y **fijar la versión** en
   `package.json`:

   ```json
   "@marraqueta/ui-modules": "github:marraqueta-lab/ui-modules#v0.3.0"
   ```

   Siempre un tag, nunca `main`: ningún cliente se actualiza solo.

8. Correr el `schema.sql` de cada módulo en Supabase, **en orden de
   dependencia** (primero los que no requieren nada — ver la tabla en el
   README de `ui-modules`).

9. Montar cada panel en su ruta. El README de cada módulo trae el snippet
   exacto. Antes de construir cualquier componente de negocio desde cero,
   revisar si ya existe en la biblioteca.

### 4. Diseño y contexto

10. Completar `CLAUDE.md` con el contexto real del proyecto.
11. Completar `DESIGN.md` (etapa 0.5) antes de escribir el primer componente.

### 5. Deploy y CI

12. Conectar un **proyecto de Vercel propio** para este cliente, con su
    dominio. Cargar ahí las variables de entorno.
13. Activar branch protection en `main` con el check `build-and-test`.
14. Opcional: definir los secretos `NEXT_PUBLIC_SUPABASE_URL` y
    `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el repo. Si no se definen, el CI usa
    valores de relleno — el build no se conecta a Supabase, así que pasa
    igual.

## Cómo trabajamos

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md): convención de ramas, PRs, y
cuándo un componente se gradúa a `ui-modules`.

## Notas para quien programa acá

- `AGENTS.md` — Next.js 16 tiene breaking changes respecto de lo que el
  modelo cree saber. Leerlo antes de escribir código.
- Todo Server Action que crea, edita o elimina **verifica el permiso en el
  servidor** con `puede()` de `@core/auth/roles`. Esconder el botón en la
  UI no es un control de acceso.
