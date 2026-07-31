import type { LucideIcon } from "lucide-react";

/**
 * Módulos montados en ESTA app. Es lo que el cliente contrató, nada más.
 *
 * Se completa al ensamblar el proyecto: por cada módulo de
 * @marraqueta/ui-modules que se monte, se agrega una entrada acá y la
 * navegación aparece sola. Ver el procedimiento en CLAUDE.md.
 *
 * Vive en la app, no en la biblioteca: el mismo módulo puede estar activo
 * en un cliente y ausente en otro, así que no puede decidirlo el paquete
 * compartido.
 */
export type ItemNavegacion = {
  /** Texto visible en la barra lateral. */
  nombre: string;
  /** Ruta dentro del dashboard, ej. "/clientes". */
  ruta: string;
  /** Ícono de lucide-react, ej. `Users`. */
  icono: LucideIcon;
  /** Agrupador opcional. Los ítems sin categoría van arriba, sueltos. */
  categoria?: string;
};

export const NAVEGACION: ItemNavegacion[] = [
  // Se completa al montar los módulos. Ejemplo:
  //
  //   import { Users, Package } from "lucide-react";
  //
  //   { nombre: "Clientes",  ruta: "/clientes",  icono: Users,   categoria: "Comercial" },
  //   { nombre: "Productos", ruta: "/productos", icono: Package, categoria: "Comercial" },
];
