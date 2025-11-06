import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/server-session";
import { authOptions } from "@/lib/auth";

function getDevEmail() { return process.env.DEV_SEED_EMAIL || "dev@local.test"; }

function num(v: any, d: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

// Default dust rates per duplicate by rarity (can be overridden via env)
const RATE_COMMON = num(process.env.NEXT_PUBLIC_DUST_RATE_COMMON, 1);
const RATE_UNCOMMON = num(process.env.NEXT_PUBLIC_DUST_RATE_UNCOMMON, 2);
const RATE_RARE = num(process.env.NEXT_PUBLIC_DUST_RATE_RARE, 5);
const RATE_EPIC = num(process.env.NEXT_PUBLIC_DUST_RATE_EPIC, 10);
const RATE_LEGENDARY = num(process.env.NEXT_PUBLIC_DUST_RATE_LEGENDARY, 20);

function rateFor(rarity?: string) {
  switch ((rarity || "").toUpperCase()) {
    case "LEGENDARY": return RATE_LEGENDARY;
    case "EPIC": return RATE_EPIC;
    case "RARE": return RATE_RARE;
    case "UNCOMMON": return RATE_UNCOMMON;
    default: return RATE_COMMON;
  }
}

export async function POST() {
  try {
    let email: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      email = session?.user?.email || null;
    } catch {}
    if (!email) email = getDevEmail();

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) user = await prisma.user.create({ data: { email } });

    // Load duplicates with rarity info
    const userItems = await prisma.userItem.findMany({
      where: { userId: user.id, qty: { gt: 1 } },
      select: { id: true, qty: true, item: { select: { rarity: true } } }
    });

    let removed = 0;
    let awarded = 0;
    const breakdown: Record<string, number> = { COMMON: 0, UNCOMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 };

    // Compute award first
    for (const ui of userItems) {
      const extra = Math.max(0, ui.qty - 1);
      if (extra > 0) {
        const rarity = (ui.item?.rarity || "COMMON").toUpperCase();
        const rate = rateFor(rarity);
        awarded += extra * rate;
        removed += extra;
        if (breakdown[rarity] !== undefined) breakdown[rarity] += extra * rate;
      }
    }

    // Persist qty reduction
    await prisma.$transaction(async (tx) => {
      for (const ui of userItems) {
        const extra = Math.max(0, ui.qty - 1);
        if (extra > 0) {
          await tx.userItem.update({ where: { id: ui.id }, data: { qty: 1 } });
        }
      }
    });

    return NextResponse.json({ ok: true, removed, awarded, breakdown, rates: { COMMON: RATE_COMMON, UNCOMMON: RATE_UNCOMMON, RARE: RATE_RARE, EPIC: RATE_EPIC, LEGENDARY: RATE_LEGENDARY } });
  } catch (err: any) {
    console.error("[remove-duplicates] error", err);
    return NextResponse.json({ error: "internal_error", detail: String(err?.message || err) }, { status: 500 });
  }
}
