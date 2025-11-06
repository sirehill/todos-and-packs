// src/lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// ---- Configure your auth here (adjust to your real logic) ----
const config = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        // Minimal example: look up user by email. Add password checks if you need them.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        return user ?? null;
      },
    }),
  ],
  // callbacks, pages, etc. can be added as needed
} satisfies NextAuthConfig;

// v5 API: we export handlers for the route, and helpers for server usage.
export const { handlers, auth, signIn, signOut } = NextAuth(config);
export type { NextAuthConfig };
