import { createClient } from "@core/supabase/server";
import type { Rol } from "./roles";

export type PerfilUsuario = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  empresa_id: string | null;
};

/**
 * Devuelve el usuario autenticado + su perfil (tabla `perfiles`).
 * Úsalo en Server Components, Route Handlers y dentro de Server Actions
 * antes de verificar `puede(perfil.rol, accion)`. Null si no hay sesión
 * o si todavía no existe la fila de perfil — en ambos casos, sin perfil
 * no hay permiso: quien llama debe tratar `null` como "sin acceso", nunca
 * asumir un rol por defecto.
 */
export async function getPerfil(): Promise<PerfilUsuario | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, empresa_id")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  return data as PerfilUsuario;
}
