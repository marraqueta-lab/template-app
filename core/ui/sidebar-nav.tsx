"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVEGACION, type ItemNavegacion } from "@core/navegacion";

/**
 * Navegación lateral. Agrupa por categoría y marca la ruta activa.
 * Usa los tokens del tema (sidebar-*), así que se re-tematiza sola cuando
 * un proyecto ajusta su paleta en globals.css.
 *
 * Importa NAVEGACION directamente en vez de recibirla por props: los
 * íconos de Lucide son componentes, y un Server Component no puede
 * pasarle funciones a uno de cliente ("Only plain objects can be passed").
 * Importando acá, las referencias nunca cruzan la frontera.
 */
export function SidebarNav() {
  const pathname = usePathname();
  const items = NAVEGACION;

  const sueltos = items.filter((i) => !i.categoria);
  const categorias = items.reduce<Record<string, ItemNavegacion[]>>((acc, item) => {
    if (item.categoria) (acc[item.categoria] ??= []).push(item);
    return acc;
  }, {});

  return (
    <nav className="flex flex-col gap-6">
      {sueltos.length > 0 && <Grupo items={sueltos} pathname={pathname} />}

      {Object.entries(categorias).map(([categoria, items]) => (
        <div key={categoria}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50">
            {categoria}
          </p>
          <Grupo items={items} pathname={pathname} />
        </div>
      ))}
    </nav>
  );
}

function Grupo({ items, pathname }: { items: ItemNavegacion[]; pathname: string }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const Icono = item.icono;
        // Activa la ruta exacta y sus subrutas (/pedidos marca en /pedidos/123),
        // sin que "/" marque en todo.
        const activo =
          pathname === item.ruta ||
          (item.ruta !== "/" && pathname.startsWith(`${item.ruta}/`));

        return (
          <li key={item.ruta}>
            <Link
              href={item.ruta}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                activo
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icono className="size-4 shrink-0" aria-hidden />
              <span>{item.nombre}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
