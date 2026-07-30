import Link from "next/link";
import { redirect } from "next/navigation";
import { SidebarNav } from "@core/ui/sidebar-nav";
import { MenuUsuario } from "@core/ui/menu-usuario";
import { getPerfil } from "@core/auth/session";
import { NAVEGACION } from "@core/navegacion";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await getPerfil();

  // El proxy ya bloquea a quien no tiene sesión. Esto cubre el otro caso:
  // sesión válida sin fila en `perfiles` (getPerfil devuelve null). Sin
  // perfil no hay empresa ni rol, así que no hay nada que mostrar.
  if (!perfil) redirect("/login");

  const nombreApp = process.env.NEXT_PUBLIC_APP_NOMBRE ?? "Mi App";

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
