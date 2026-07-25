# CONTRIBUTING

Cómo trabajamos en los repos de Marraqueta Lab. Aplica a este template y a
las apps de cliente que nacen de él.

## Ramas

**Nunca se commitea directo a `main`.** Todo cambio entra por pull request,
incluso los de una línea, incluso los propios.

Nomenclatura:

| Prefijo | Cuándo | Ejemplo |
|---|---|---|
| `feature/` | Funcionalidad nueva | `feature/scanner-boletas` |
| `fix/` | Corrección de un bug | `fix/precio-recetas-compuestas` |

Formato: `<prefijo>/<descripción-corta-en-kebab-case>`. En español, sin
números de ticket, lo bastante descriptivo para entenderse desde la lista de
PRs sin abrirla.

La rama se borra al mergear. Si un trabajo se alarga, se rebasa contra `main`
en vez de acumular merges de vuelta.

## Pull requests

- La PR describe **qué cambia y por qué**, no el listado de archivos (eso ya
  está en el diff).
- El check de CI (`lint`, `test`, `build`) tiene que pasar antes del merge.
  `main` debe tener branch protection activa exigiendo ese check.
- Si el cambio toca la base de datos, la PR incluye la migración
  (`supabase migration new`). Nunca cambios hechos desde el dashboard.

### Quién revisa qué

> **[CONFIRMAR CON TOMÁS]** — El reparto de revisión de PRs todavía no está
> acordado entre Gino y Tomás. Hasta que se confirme, cada PR se asigna al
> otro socio y no se mergea sin al menos una aprobación.
>
> Al cerrar el acuerdo, reemplazar este bloque por el reparto definitivo
> (qué repos revisa cada uno, y qué pasa cuando el revisor no está
> disponible).

## Código escrito con IA

Vale usar Claude Code y equivalentes para escribir código — es parte del
método. Lo que no vale es abrir una PR con código que no se revisó línea por
línea. **Quien abre la PR responde por el código, lo haya escrito o no.**

Antes de escribir código en este stack, leer `AGENTS.md`: Next.js 16 tiene
breaking changes respecto de lo que el modelo cree saber.

## Graduación de componentes hacia `ui-modules`

El fee mensual solo es sostenible si el esfuerzo de desarrollo baja con cada
cliente nuevo. Eso depende de que la biblioteca compartida crezca — pero
crezca con lo correcto. Un módulo que se sube antes de tiempo se vuelve deuda
en todos los clientes a la vez.

**Un componente se gradúa a `ui-modules` cuando cumple las dos condiciones:**

1. **Se necesita en un segundo cliente.** No basta con que "parezca
   reutilizable". Hasta que haya un segundo caso real, vive en el repo del
   cliente donde nació.
2. **Está desacoplado de la lógica del cliente original.** Sin nombres de
   tablas propios, sin reglas de negocio específicas, sin textos ni
   supuestos de ese negocio. Lo que varía entra por props o configuración.

Si cumple (1) pero no (2), el trabajo previo a la graduación es desacoplarlo
— no copiarlo y adaptarlo en el segundo cliente. Copiar y adaptar es
justamente lo que la biblioteca existe para evitar.

**Mientras tanto**: un componente que se usa en un solo cliente se queda en
ese repo. No hay penalización por no graduar; sí la hay por graduar de más.

## Versionado de la biblioteca

Las apps consumen `@marraqueta/ui-modules` apuntando a un **tag específico**,
no a `main`:

```json
"@marraqueta/ui-modules": "github:marraqueta-lab/ui-modules#v0.1.0"
```

Al mejorar un módulo se publica un tag nuevo y se actualiza a mano la línea
del `package.json` de cada cliente que corresponda. **Ningún cliente se
actualiza solo.** Es deliberado: evita romper la producción de un cliente
por un cambio pensado para otro.
