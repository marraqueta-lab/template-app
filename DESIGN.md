# DESIGN.md

> Se completa en la etapa 0.5, antes de escribir el primer componente,
> con los lineamientos ya conversados con el cliente.
>
> **Esto captura las desviaciones respecto de la base, no el diseño
> completo.** El template ya trae un sistema funcionando (shadcn/ui preset
> Vega + Lucide + tokens semánticos). Lo que no se anote acá se queda con
> el default, y está bien que así sea: cada app de cliente se ve distinta
> pero parte del mismo lugar.

## Identidad

- Cliente:
- Qué transmite la marca (2-3 palabras):

## Paleta

Se ajusta en `app/globals.css`, cambiando los tokens de `:root` y `.dark`.
No se agregan colores sueltos en las clases: si se cambian los tokens, la
app entera —incluidos los paneles de `ui-modules`— se re-tematiza sola.

| Token | Para qué | Valor del cliente |
|---|---|---|
| `--primary` | Acciones principales, botones | |
| `--background` / `--foreground` | Fondo y texto base | |
| `--muted-foreground` | Texto secundario | |
| `--sidebar` | Fondo de la barra lateral | |
| `--sidebar-accent` | Ítem activo del menú | |
| `--destructive` | Acciones de borrado | |
| `--radius` | Redondez general (default `0.625rem`) | |

Los valores van en formato `oklch()`, como el resto del archivo.

## Tipografía

- Fuente principal (default: Inter):
- Fuente de títulos, si difiere:

## Íconos

Lucide (default del template). Solo cambiar si el proyecto lo justifica.

## Pantallas clave

Las 3-5 más importantes para este cliente. Link al mockup o descripción
breve:

1.
2.
3.

## Desviaciones del sistema base

Cualquier cosa donde este cliente se aparta de lo que trae el template, y
por qué:

-

## Notas de UX

-
