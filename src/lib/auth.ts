// src/lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Make TypeScript happy & avoid '{}' by guarding the type
        const email =
          typeof credentials?.email === "string" ? credentials.email : null;

        if (!email) return null;

        // (Optional) add password verification later if you need it
        const user = await prisma.user.findUnique({
          where: { email }
        });

        return user ?? null;
      }
    })
  ]
  // callbacks/pages can be added here later
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export type { NextAuthConfig };
