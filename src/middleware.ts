export { auth as middleware } from "@/auth";
export { default } from "@/auth";
export const config = { matcher: ["/lists/:path*", "/api/open-pack", "/api/preview-pack", "/api/commit-pack"] };
