import { createClient } from "@core/supabase/server";
import { getPerfil } from "@core/auth/session";

/**
 * Multi-empresa: cada fila de datos lleva `empresa_id`. Estas utilidades
 * resuelven la empresa activa del usuario para aislar los datos por cliente.
 *
 * Recomendación: aplica también Row Level Security (RLS) en Supabase
 * filtrando por empresa_id (ver supabase/migrations).
 */
export async function empresaActivaId(): Promise<string | null> {
  const perfil = await getPerfil();
  return perfil?.empresa_id ?? null;
}

export type Empresa = {
  id: string;
  nombre: string;
  rut: string | null;
  activo: boolean;
};

export async function listarEmpresas(): Promise<Empresa[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("empresas")
    .select("id, nombre, rut, activo")
    .eq("activo", true)
    .order("nombre");
  return (data as Empresa[]) ?? [];
}
