import { getPerfil } from "@core/auth/session";
import { NAVEGACION } from "@core/navegacion";

export default async function Inicio() {
  const perfil = await getPerfil();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">
        Hola{perfil?.nombre ? `, ${perfil.nombre}` : ""}
      </h1>
      <p className="text-sm text-muted-foreground">
        {NAVEGACION.length === 0
          ? "Todavía no hay módulos montados en esta app."
          : "Elige un módulo en el menú lateral para empezar."}
      </p>
    </div>
  );
}
