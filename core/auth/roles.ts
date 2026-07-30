/**
 * Roles y permisos base. Personaliza los roles según cada pyme: lo
 * habitual es admin (todo) + uno o dos roles operativos.
 */
export type Rol = "admin" | "gestor" | "operador" | "solo_lectura";

export const ROLES: Rol[] = ["admin", "gestor", "operador", "solo_lectura"];

export const ROL_LABEL: Record<Rol, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  operador: "Operador",
  solo_lectura: "Solo lectura",
};

/** Acciones genéricas que un módulo puede exigir. */
export type Accion = "ver" | "crear" | "editar" | "eliminar";

/** Matriz simple de permisos por rol. Ajústala por proyecto. */
const MATRIZ: Record<Rol, Accion[]> = {
  admin: ["ver", "crear", "editar", "eliminar"],
  gestor: ["ver", "crear", "editar"],
  operador: ["ver", "crear"],
  solo_lectura: ["ver"],
};

export function puede(rol: Rol, accion: Accion): boolean {
  return MATRIZ[rol]?.includes(accion) ?? false;
}
