// src/app/api/preview-pack/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if needed

type PreviewPackRequestBody = {
  packTypeId?: string;     // <-- opener sends this
  previewCount?: number;
};

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export async function POST(req: Request) {
  try {
    let body: PreviewPackRequestBody = {};
    try {
      body = (await req.json()) as PreviewPackRequestBody;
    } catch {}

    // Optional: read session; not strictly required for preview
    const session = (await getServerSession(authOptions as any)) as Session | null;
    const email = (session?.user?.email as string | undefined) ?? null;

    const packTypeId = body.packTypeId ?? "default";
    const previewCount = body.previewCount ?? 3;

    // Build a lightweight, deterministic preview (replace with your real logic later)
    const samplePreview = Array.from({ length: previewCount }).map((_, i) => ({
      itemId: `${packTypeId}-item-${i + 1}`,
      name: `Sample Card ${i + 1}`,
      rarity: (["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"] as const)[i % 5],
    }));

    // IMPORTANT: return { ok: true, items: [...] } to match HomePackOpener expectations
    return json(
      {
        ok: true,
        user: email ?? "guest",
        packTypeId,
        items: samplePreview
      },
      200
    );
  } catch (err) {
    console.error("preview-pack error:", err);
    return json({ ok: false, error: "Internal server error" }, 500);
  }
}
