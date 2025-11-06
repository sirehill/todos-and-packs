// src/app/api/commit-pack/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-session";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth"; // <- adjust this path if your authOptions live elsewhere

// Example helper types (adjust to your app's real types if you have them)
type CommitPackRequestBody = {
  packId?: string;
  choices?: Record<string, unknown>;
};

// Minimal response helpers
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export async function POST(req: Request) {
  try {
    // parse body (be defensive)
    let body: CommitPackRequestBody = {};
    try {
      body = (await req.json()) as CommitPackRequestBody;
    } catch {
      // ignore parse error; we'll use empty body
    }

    // Get the session, typed as NextAuth's Session
    // getServerSession can return Session | null
    const session = (await getServerSession(authOptions as any)) as
      | Session
      | null;

    // Safely extract user email
    const userEmail: string | null =
      (session?.user?.email as string | undefined) ?? null;

    // If your API requires authentication, enforce it:
    if (!userEmail) {
      return json({ error: "Unauthorized" }, 401);
    }

    // --- Your app's commit-pack logic goes here ---
    // For example: validate packId, update inventory, add energy, etc.
    // I'm providing a minimal placeholder implementation so the API builds and returns success.
    const packId = body.packId ?? "unknown-pack";
    // Simulate doing some work (e.g., update local DB or in-memory store)
    const result = {
      success: true,
      message: `Committed pack ${packId} for ${userEmail}`,
      awardedEnergy: 5, // example
    };

    return json(result, 200);
  } catch (err) {
    // Keep error details minimal for production; include more during debugging
    console.error("commit-pack error:", err);
    return json({ error: "Internal server error" }, 500);
  }
}
