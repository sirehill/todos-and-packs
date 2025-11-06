// src/app/page.tsx
import React from "react";
import PackGate from "@/components/PackGate";
import HomeDuplicatesSection from "@/components/HomeDuplicatesSection";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust if your authOptions live elsewhere

function getDevEmail() {
  return process.env.DEFAULT_USER_EMAIL || "demo@example.com";
}

export default async function Page() {
  // Get a session safely (typed as Session | null)
  const session = (await getServerSession(authOptions as any)) as Session | null;
  const email: string | null = (session?.user?.email as string | undefined) ?? null;
  const userEmail = email ?? getDevEmail();

  return (
    <main className="max-w-5xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Packs &amp; Lists</h1>
        <p className="text-sm text-muted-foreground">
          Welcome{email ? `, ${session?.user?.name ?? ""}` : ""}.
        </p>
      </header>

      <section className="mb-8">
        {/* Pack opener UI wrapped in PackGate (opens modal, checks energy, etc.) */}
        <PackGate />
      </section>

      <section className="mb-8">
        {/* Duplicates / dusting section */}
        <HomeDuplicatesSection />
      </section>

      <section className="mt-10 border-t pt-6">
        {/* Link users to the Lists area where CollectionGrid is rendered with proper props */}
        <h2 className="text-xl font-semibold mb-2">Your Collections</h2>
        <p className="text-sm text-muted-foreground mb-3">
          View progress and open packs for each list on the Lists pages.
        </p>
        <Link href="/lists" className="underline">
          Go to Lists
        </Link>
      </section>
    </main>
  );
}
