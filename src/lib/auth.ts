// src/lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  // Make password optional if you’re not verifying it yet
  password: z.string().min(1).optional(),
});

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
      async authorize(raw) {
        // Validate & coerce credentials to typed strings
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email } = parsed.data;

        // TODO: add proper password verification when ready
        const user = await prisma.user.findUnique({
          where: { email },
        });
        return user ?? null;
      },
    }),
  ],
  // Add callbacks/pages if you need them later
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export type { NextAuthConfig };
