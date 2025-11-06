import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import dynamic from "next/dynamic";

const CollectionGrid = dynamic(() => import("@/components/CollectionGrid"), { ssr: false });

export default async function ListDetail({ params }: { params: { slug: string } }) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const list = await prisma.list.findUnique({
    where: { slug: params.slug },
    include: { items: true }
  });
  if (!list) return <div>List not found.</div>;

  // Ownership: collapse user items by itemId -> qty
  const userItems = await prisma.userItem.findMany({
    where: {
      user: { email: session.user.email },
      item: { listId: list.id }
    },
    select: { itemId: true, qty: true }
  });
  const qtyByItem = new Map(userItems.map(ui => [ui.itemId, ui.qty]));

  const items = list.items.map(it => ({
    id: it.id,
    name: it.name,
    rarity: (it as any).rarity ?? null,
    qty: qtyByItem.get(it.id) ?? 0
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{list.name}</h1>
          <p className="text-sm text-zinc-500">{items.filter(i => i.qty > 0).length}/{items.length} discovered</p>
        </div>
      </div>

      <CollectionGrid listName={list.name} items={items} />
    </div>
  );
}
