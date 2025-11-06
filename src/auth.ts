import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";

// TODO: Replace providers with your actual providers (Google, GitHub, Credentials, etc.)
const config = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [],
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
