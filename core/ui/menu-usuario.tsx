"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { cerrarSesion } from "@core/auth/cerrar-sesion";
import { ROL_LABEL, type Rol } from "@core/auth/roles";

export function MenuUsuario({ nombre, rol }: { nombre: string; rol: Rol }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right leading-tight">
        <p className="text-sm font-medium">{nombre}</p>
        <p className="text-xs text-muted-foreground">{ROL_LABEL[rol]}</p>
      </div>
      <button
        onClick={() => startTransition(() => cerrarSesion())}
        disabled={pending}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <LogOut className="size-4" aria-hidden />
      </button>
    </div>
  );
}
