export { default } from "next-auth/middleware";
export const config = { matcher: ["/lists/:path*", "/api/open-pack", "/api/preview-pack", "/api/commit-pack"] };
