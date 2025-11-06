// src/app/api/preview-pack/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if your authOptions live elsewhere

type PreviewPackRequestBody = {
  packId?: string;
  previewCount?: number;
};

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export async function POST(req: Request) {
  try {
    // parse body defensively
    let body: PreviewPackRequestBody = {};
    try {
      body = (await req.json()) as PreviewPackRequestBody;
    } catch {
      // ignore parse errors; keep body default
    }

    // get session typed as NextAuth Session or null
    const session = (await getServerSession(authOptions as any)) as
      | Session
      | null;

    // safe extraction of email
    let email: string | null =
      (session?.user?.email as string | undefined) ?? null;

    // fallback for local/dev usage or anonymous preview
    if (!email) email = process.env.DEFAULT_USER_EMAIL || "demo@example.com";

    const packId = body.packId ?? "unknown-pack";
    const previewCount = body.previewCount ?? 3;

    // --- minimal preview logic (replace with your real behaviour) ---
    // Here we simulate generating a preview (list of card keys, rarities, etc.)
    // Keep consistent with your frontend expectations.
    const samplePreview = Array.from({ length: previewCount }).map((_, i) => ({
      id: `${packId}-preview-${i + 1}`,
      name: `Sample Card ${i + 1}`,
      rarity: ["common", "rare", "epic"][i % 3],
    }));

    return json(
      {
        success: true,
        previewFor: packId,
        user: email,
        items: samplePreview,
      },
      200
    );
  } catch (err) {
    console.error("preview-pack error:", err);
    return json({ error: "Internal server error" }, 500);
  }
}
