import type { NextRequest } from "next/server";
import { updateSession } from "@core/supabase/proxy";

// Protege toda la app: sin sesión, redirige a /login.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Todo excepto assets estáticos.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
