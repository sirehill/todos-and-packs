// src/app/page.tsx
import React from "react";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if needed

// Import existing page components (these should already exist in your project)
import HomePackOpener from "@/components/HomePackOpener";
import HomeDuplicatesSection from "@/components/HomeDuplicatesSection";
import CollectionGrid from "@/components/CollectionGrid";

/**
 * Returns a dev/demo fallback email for local usage.
 * Update DEFAULT_USER_EMAIL in Vercel / .env if you want to customize this.
 */
function getDevEmail() {
  return process.env.DEFAULT_USER_EMAIL || "demo@example.com";
}

export default async function Page() {
  // getServerSession returns Session | null — cast it so TypeScript knows the shape
  const session = (await getServerSession(authOptions as any)) as Session | null;

  // Safely read user email
  const email: string | null = (session?.user?.email as string | undefined) ?? null;

  // If no logged-in user, fallback to a dev/demo email
  const userEmail = email ?? getDevEmail();

  // You can pass userEmail to child components if they expect it,
  // or use it for server-side logic here.
  return (
    <main className="max-w-5xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Packs & Lists</h1>
        <p className="text-sm text-muted-foreground">Welcome{email ? `, ${session?.user?.name ?? ""}` : ""}.</p>
      </header>

      <section className="mb-8">
        {/* Pack opener UI */}
        {/* If HomePackOpener expects props you can pass userEmail as needed */}
        <HomePackOpener userEmail={userEmail} />
      </section>

      <section className="mb-8">
        {/* Duplicates / dusting */}
        <HomeDuplicatesSection userEmail={userEmail} />
      </section>

      <section>
        {/* Collection grid */}
        <CollectionGrid userEmail={userEmail} />
      </section>
    </main>
  );
}
