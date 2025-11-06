import prisma from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function ListsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const userId = user?.id ?? "";

  // Fetch lists with counts
  const lists = await prisma.list.findMany({
    include: {
      items: { select: { id: true } },
      packs: { select: { id: true, name: true } }
    }
  });

  // For progress, count distinct items owned per list
  const userItems = userId
    ? await prisma.userItem.findMany({ where: { userId }, select: { itemId: true, item: { select: { listId: true } } } })
    : [];

  const ownedByList = new Map<string, number>();
  for (const ui of userItems) {
    const listId = ui.item.listId;
    ownedByList.set(listId, (ownedByList.get(listId) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lists</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {lists.map(l => {
          const total = l.items.length;
          const owned = ownedByList.get(l.id) ?? 0;
          const pct = total ? Math.round((owned / total) * 100) : 0;
          return (
            <div key={l.id} className="border rounded p-4 bg-white space-y-2">
              <h2 className="font-semibold">{l.name}</h2>
              <p className="text-sm text-slate-600">{l.description}</p>
              <div className="text-xs text-slate-600">{owned}/{total} collected</div>
              <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3">
                <Link href={`/lists/${l.slug}`} className="underline">Open Packs</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
