import RefreshOnInventory from './refresh-on-inventory';
import prisma from "@/lib/prisma";
import Link from "next/link";
import HomePackOpener from "./home-pack-opener";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HomeTodoSection from '@/components/HomeTodoSection';
import HomeDuplicatesSection from "@/components/HomeDuplicatesSection";

function getDevEmail() {
  return process.env.DEV_SEED_EMAIL || "dev@local.test";
}

export default async function Page() {
  // Identify user (session email or dev fallback)
  let email: string | null = null;
  try {
    const session = await getServerSession(authOptions as any);
    email = (session?.user?.email as string | undefined) ?? null;
  } catch {}
  if (!email) email = getDevEmail();

  // Fetch lists and their pack ids
  const lists = await prisma.list.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { items: true } },
      packs: { select: { id: true } },
    },
  });

  // Resolve user and userItems (optional)
  let user = await prisma.user.findUnique({ where: { email } });
  let userItems: { item: { listId: string } }[] = [];
  if (user) {
    try {
      userItems = await prisma.userItem.findMany({
        where: { userId: user.id },
        select: { item: { select: { listId: true } } },
      });
    } catch {}
  }

  // Build progress map: listId -> count of distinct owned items
  const ownedMap = new Map<string, number>();
  for (const ui of userItems) {
    const lid = ui.item?.listId;
    if (!lid) continue;
    ownedMap.set(lid, (ownedMap.get(lid) || 0) + 1);
  }

  const openerOptions = lists
    .map(l => ({ id: l.id, name: l.name, packTypeId: l.packs?.[0]?.id || "" }))
    .filter(o => o.packTypeId);

  return (
    <>
      <RefreshOnInventory />
      <div className="space-y-4">
      {/* Intro moved to top */}
<div className="mb-4">
  <h1 className="text-2xl font-bold">Welcome 👋</h1>
  <p className="text-slate-700"></p>
</div>

<HomeTodoSection />
<hr className="my-4 border-slate-200" />
{/* Open Pack on Home (with selector) */}
      <HomePackOpener options={openerOptions as any} />


            <HomeDuplicatesSection />
{/* Lists with progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {lists.map((l) => {
          const owned = ownedMap.get(l.id) || 0;
          const total = l._count.items || 0;
          const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
          return (
            <div key={l.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-slate-500">{total} items</div>
                </div>
                <Link
                  href={`/lists/${l.slug}`}
                  className="text-sm px-3 py-1 rounded border hover:bg-slate-50"
                >
                  See collection
                </Link>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Progress</span>
                  <span>{owned}/{total} ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}