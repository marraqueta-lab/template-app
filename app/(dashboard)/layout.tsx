import Link from "next/link";
import { SidebarNav } from "@core/ui/sidebar-nav";
import { MenuUsuario } from "@core/ui/menu-usuario";
import { getPerfil } from "@core/auth/session";
import { cerrarSesion } from "@core/auth/cerrar-sesion";
import { NAVEGACION } from "@core/navegacion";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await getPerfil();

  const nombreApp = process.env.NEXT_PUBLIC_APP_NOMBRE ?? "Mi App";

  // El proxy ya bloquea a quien no tiene sesión. Acá se cubren los dos casos
  // que quedan, ambos de aprovisionamiento incompleto.
  //
  // No se redirige a /login: el proxy manda de vuelta a "/" a cualquiera con
  // sesión válida, así que redirigir desde acá genera un bucle infinito.
  if (!perfil) {
    return <CuentaSinConfigurar nombreApp={nombreApp} detalle="perfil" />;
  }
  if (!perfil.empresa_id) {
    return <CuentaSinConfigurar nombreApp={nombreApp} detalle="empresa" />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-4 md:block">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 px-3 text-sidebar-foreground"
        >
          <span className="font-semibold">{nombreApp}</span>
        </Link>
        <SidebarNav items={NAVEGACION} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="font-medium md:hidden">{nombreApp}</span>
          <div className="ml-auto">
            <MenuUsuario nombre={perfil.nombre || perfil.email} rol={perfil.rol} />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

/**
 * La cuenta existe en Auth pero le falta aprovisionamiento. El usuario no
 * puede resolverlo solo —no hay policies que se lo permitan, a propósito—
 * así que la pantalla explica qué falta sin prometer una acción imposible.
 * Ver supabase/provisionar.sql.
 */
function CuentaSinConfigurar({
  nombreApp,
  detalle,
}: {
  nombreApp: string;
  detalle: "perfil" | "empresa";
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md space-y-3 text-center">
        <h1 className="text-lg font-semibold">{nombreApp}</h1>
        <p className="text-sm text-muted-foreground">
          {detalle === "perfil"
            ? "Tu cuenta todavía no tiene un perfil asociado."
            : "Tu cuenta todavía no está asignada a una empresa."}{" "}
          Escríbenos y lo dejamos listo.
        </p>
        <form action={cerrarSesion}>
          <button type="submit" className="text-sm text-primary hover:underline">
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
