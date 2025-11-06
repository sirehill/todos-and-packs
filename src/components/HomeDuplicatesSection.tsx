import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RemoveDuplicatesButton from "./RemoveDuplicatesButton";

function getDevEmail() { return process.env.DEV_SEED_EMAIL || "dev@local.test"; }

export default async function HomeDuplicatesSection() {
  // Identify user (session or dev fallback)
  let email: string | null = null;
  try {
    const session = await getServerSession(authOptions);
    email = session?.user?.email || null;
  } catch {}
  if (!email) email = getDevEmail();

  // Try to find user; if none yet, render section with 0 duplicates
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) {
    return (
      <section className="my-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
        <h2 className="text-2xl font-semibold">Duplicates</h2>
        <p className="text-sm opacity-70">You currently have <span className="font-semibold">0</span> duplicates in your collection.</p>
        <div className="pt-2"><RemoveDuplicatesButton disabled={false} /></div>
    </section>
    );
  }

  // Count duplicates (qty > 1 contributes qty-1)
  const userItems = await prisma.userItem.findMany({
    where: { userId: user.id, qty: { gt: 1 } },
    select: { qty: true }
  });
  const duplicates = userItems.reduce((sum, ui) => sum + Math.max(0, ui.qty - 1), 0);

  return (
    <section className="my-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
      <h2 className="text-2xl font-semibold">Duplicates</h2>
      <p className="text-sm opacity-70">
        You currently have <span className="font-semibold">{duplicates}</span> duplicate{duplicates === 1 ? "" : "s"} in your collection.
      </p>
      <div className="pt-2"><RemoveDuplicatesButton disabled={false} /></div>
    </section>
  );
}
