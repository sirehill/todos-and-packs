import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Rarity = "COMMON"|"UNCOMMON"|"RARE"|"EPIC"|"LEGENDARY";
type Card = { itemId: string; rarity: Rarity; name: string };

export async function POST(req: Request) {
  try {
    // Resolve user via session or fallback
    let email: string | null = null;
    try {
      const session = await getServerSession(authOptions as any);
      email = (session?.user?.email as string | undefined) ?? null;
    } catch {}
    if (!email) email = process.env.DEFAULT_USER_EMAIL || "demo@example.com";

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true }
    });

    const body = await req.json().catch(() => ({} as any));
    const packTypeId: string | null = body?.packTypeId ?? null;
    if (!packTypeId) {
      return NextResponse.json({ error: "missing_packTypeId" }, { status: 400 });
    }

    const packType = await prisma.packType.findUnique({
      where: { id: packTypeId },
      include: { list: true }
    });
    if (!packType) {
      return NextResponse.json({ error: "invalid_pack_type" }, { status: 400 });
    }

    const drops = await prisma.dropTable.findMany({ where: { packTypeId } });
    if (!drops.length) {
      return NextResponse.json({ error: "empty_drop_table" }, { status: 400 });
    }
    // v0.6.6: TEST MODE - equal chance for all rarities
    const testDrops = [
      { rarity: "COMMON", prob: 1 },
      { rarity: "UNCOMMON", prob: 1 },
      { rarity: "RARE", prob: 1 },
      { rarity: "EPIC", prob: 1 },
      { rarity: "LEGENDARY", prob: 1 },
    ] as any;

    function pickRarity(rows: any[]): Rarity {
      const order: Rarity[] = ["COMMON","UNCOMMON","RARE","EPIC","LEGENDARY"];
      const byR: Record<Rarity, number> = { COMMON:0, UNCOMMON:0, RARE:0, EPIC:0, LEGENDARY:0 };
      for (const r of rows) {
        const rr = (r?.rarity as Rarity) || "COMMON";
        const p = Number(r?.prob ?? 0);
        if (rr in byR) byR[rr] += p;
      }
      const total = order.reduce((a, k) => a + (byR[k] || 0), 0) || 1;
      let roll = Math.random() * total;
      for (const k of order) {
        roll -= (byR[k] || 0);
        if (roll <= 0) return k;
      }
      return "COMMON";
    }

    const need = packType.cardsPerPack ?? 4;
const cards: Card[] = [];

// cache items by rarity to avoid repeated queries
const cacheByRarity: Record<string, {id:string,name:string}[]> = {};
async function getPool(rarity: Rarity): Promise<{id:string,name:string}[]> {
  const key = `${packType.listId}-${rarity}`;
  if (cacheByRarity[key]) return cacheByRarity[key];
  const pool = await prisma.item.findMany({
    where: { listId: packType.listId, rarity },
    select: { id: true, name: true }
  });
  cacheByRarity[key] = pool;
  return pool;
}

const fallbackPool = await prisma.item.findMany({
  where: { listId: packType.listId },
  select: { id: true, name: true }
});

for (let i = 0; i < need; i++) {
  const rarity = pickRarity(testDrops);
  let pool = await getPool(rarity);
  if (!pool.length) pool = fallbackPool;
  if (!pool.length) return NextResponse.json({ error: "no_items_for_list" }, { status: 400 });

  // sample uniformly at random
  const idx = Math.floor(Math.random() * pool.length);
  const item = pool[idx];
  cards.push({ itemId: item.id, rarity, name: item.name });
}


    // Create preview (no credits logic in v0.6.x schema)
    await prisma.packPreview.create({
      data: {
        user: { connect: { id: user.id } },
        packType: { connect: { id: packType.id } },
        cards: JSON.stringify(cards)
      }
    });

    await prisma.$transaction(async (tx) => {
  await tx.packOpen.create({
    data: {
      user: { connect: { id: user.id } },
      packType: { connect: { id: packType.id } },
      result: JSON.stringify(cards)
    }
  });
  for (const c of cards) {
    await tx.userItem.upsert({
      where: { userId_itemId: { userId: user.id, itemId: c.itemId } },
      update: { qty: { increment: 1 } },
      create: { userId: user.id, itemId: c.itemId, qty: 1 }
    });
  }
});
return NextResponse.json({ ok: true, committed: true, cards });

  } catch (err: any) {
    console.error("[preview-pack] error", err);
    return NextResponse.json({ error: "internal_error", detail: String(err?.message || err) }, { status: 500 });
  }
}
