# Fallback Scan Report

This report lists potential fallback/placeholder code paths that may disable features.
I also auto-toggled any `DISABLE_* = true` flags to `false` where found.

## Toggled Feature Flags
- None found.

## Files with Potential Fallback Paths

### src/app/page.tsx
- Pattern: `\bfallback\b`
```
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
```

### src/app/refresh-on-inventory.tsx
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```
useEffect(() => {
    const on = () => router.refresh();
    window.addEventListener("pl:inventory" as any, on as any);
    return () => window.removeEventListener("pl:inventory" as any, on as any);
  }, [router]);
  return null;
}
```

### src/app/api/commit-pack/route.ts
- Pattern: `\bfallback\b`
```
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
```

### src/app/api/preview-pack/route.ts
- Pattern: `\bfallback\b`
```
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
```

### src/app/lists/page.tsx
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```

```

### src/app/lists/[slug]/pack-opener.tsx
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```
// Minimal placeholder to avoid JSX parse issues on the collection page.
// This intentionally renders nothing. We can re-enable the UI later.
export default function PackOpener(_: { packTypeId: string }) {
  return null;
}
```

### src/app/lists/[slug]/page.tsx
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```
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
```

### src/components/HomeDuplicatesSection.tsx
- Pattern: `\bfallback\b`
```
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
```

### src/data/imageLookup.ts
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```
export function getImgForList(listName: string | null | undefined, itemName: string) {
  const n = (listName || "").toLowerCase();
  if (n.includes("animal")) return getAnimalImg(itemName);
  if (n.includes("countr")) return getCountryImg(itemName);
  return null;
}

export function getAnyImg(itemName: string) {
  const k = toKey(itemName);
  const a = (AnimalImages as any)[k];
  if (a) return a;
  const c = (CountryImages as any)[k];
  if (c) return c;
  return null;
```
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```
return null;
}

export function getAnyImg(itemName: string) {
  const k = toKey(itemName);
  const a = (AnimalImages as any)[k];
  if (a) return a;
  const c = (CountryImages as any)[k];
  if (c) return c;
  return null;
}
```

### src/lib/auth.ts
- Pattern: `return\s*null\s*;?\s*(?:\/\/.*placeholder.*)?`
```
Credentials({
      name: "Dev Email",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        const email = (creds?.email || "").toString().toLowerCase().trim();
        if (!email) return null;
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) user = await prisma.user.create({ data: { email } });
        return { id: user.id, email: user.email, name: user.name ?? user.email };
      }
    })
  ],
  pages: { signIn: "/login" },
```

### src/lib/storage.ts
- Pattern: `\bfallback\b`
```
return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key: string, value: unknown) => {
```
- Pattern: `\bfallback\b`
```
export const save = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
```
- Pattern: `\bfallback\b`
```
localStorage.setItem(key, JSON.stringify(value));
};
```
- Pattern: `\bfallback\b`
```
export const load = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};
```
