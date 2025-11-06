import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Card = { itemId: string; rarity: string; name?: string };

function getDevEmail() {
  return process.env.DEV_SEED_EMAIL || "dev@local.test";
}

export async function POST(req: Request) {
  try {
    let userEmail: string | null = null;

    // Try NextAuth session first
    try {
      const session = await getServerSession(authOptions as any);
      userEmail = (session?.user?.email as string | undefined) ?? null;
    } catch {}

    // Fallback to DEV email for local/dev usage
    if (!userEmail) {
      userEmail = getDevEmail();
    }

    // Ensure user exists (create if missing)
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({ data: { email: userEmail } });
    }

    // Parse body
    const body = await req.json();
    const previewId: string | null = (body?.previewId || body?.id || body?.preview) ?? null;
    let cards: Card[] | null = Array.isArray(body?.cards) ? body.cards : null;

    // If not provided, try to load from a preview record (if you have one)
    if (!cards && previewId) {
      try {
        // @ts-ignore - optional model
        const prev = await prisma.packPreview.findUnique({ where: { id: previewId } });
        if (prev?.result?.cards) {
          cards = prev.result.cards as Card[];
        }
      } catch {}
    }

    if (!cards || cards.length === 0) {
      return NextResponse.json({ error: "invalid preview" }, { status: 400 });
    }

    // Commit items
    for (const c of cards) {
      await prisma.userItem.upsert({
        where: { userId_itemId: { userId: user.id, itemId: c.itemId } },
        update: { qty: { increment: 1 } },
        create: { userId: user.id, itemId: c.itemId, qty: 1 },
      });
    }

    // Optionally record the open
    try {
      await prisma.packOpen.create({
        data: { userId: user.id, result: { cards }, openedAt: new Date() },
      });
    } catch {}

    return NextResponse.json({ ok: true, cards });
  } catch (err: any) {
    console.error("[commit-pack] error", err);
    return NextResponse.json({ error: "internal_error", detail: String(err?.message || err) }, { status: 500 });
  }
}
