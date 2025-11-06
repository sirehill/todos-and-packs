// src/middleware.ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  // adjust matchers to your protected sections
  matcher: ["/packs/:path*", "/collections/:path*", "/lists/:path*"],
};
