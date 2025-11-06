// NextAuth v5 compatibility shim for legacy getServerSession usage
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

/**
 * Drop-in replacement for v4's auth().
 * Call it exactly the same way you did before, but it ignores the argument.
 */
export async function auth(): Promise<Session | null> {
  return auth();
}
