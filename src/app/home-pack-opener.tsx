"use client";
import { useEffect, useState } from "react";
import { getEnergy, canOpenPack, consumeForPack } from "@/lib/energy";
import { useRouter } from "next/navigation";
import PixelArtImage from "@/components/PixelArtImage";
import { getImgForList, getAnyImg } from "@/data/imageLookup";

type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
type Card = { itemId: string; rarity: Rarity; name: string };
type Opt = { id: string; name: string; packTypeId: string };

function rarityClass(r: string) {
  switch (r) {
    case "LEGENDARY":
      return "pl-legendary";
    case "EPIC":
      return "pl-epic";
    case "RARE":
      return "pl-rare";
    case "UNCOMMON":
      return "pl-uncommon";
    default:
      return "pl-common";
  }
}

export default function HomePackOpener({ options }: { options: Opt[] }) {
  const router = useRouter();
  const [energy, setEnergy] = useState(0);
  const [threshold, setThreshold] = useState(50);
  const [openable, setOpenable] = useState(false);

  const [selected, setSelected] = useState<string>(options?.[0]?.packTypeId || "");
  const [selectedName, setSelectedName] = useState<string>(options?.[0]?.name || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[] | null>(null);
  const [revealIndex, setRevealIndex] = useState<number>(-1); // -1 = hidden backs

  useEffect(() => {
    const id = setInterval(() => {
      const e = getEnergy();
      setEnergy(e.value);
      setThreshold(e.threshold);
      setOpenable(canOpenPack());
    }, 500);
    return () => clearInterval(id);
  }, []);

  async function openNow() {
    try {
      setBusy(true);
      setError(null);
      setCards(null);
      setRevealIndex(-1);

      // consume energy (client-side for demo parity with v0.14)
      if (!canOpenPack()) {
        setError("not_enough_energy");
        return;
      }
      consumeForPack();

      const res = await fetch("/api/preview-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packTypeId: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "open_failed");
        return;
      }
      setCards(data.cards as Card[]);
      // Simple reveal animation + refresh lists when done
      let i = 0;
      const total = (data.cards as Card[]).length;
      const t = setInterval(() => {
        i += 1;
        setRevealIndex(i - 1);
        if (i >= total) {
          clearInterval(t);
          // allow the last flip to render, then refresh server data (lists, duplicates, energy, etc.)
          setTimeout(() => {
            try { router.refresh(); } catch {}
          }, 250);
        }
      }, 200);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium">Choose a pack:</label>
        <select
          className="border rounded px-2 py-1"
          value={selected}
          onChange={(e) => {
            const v = e.target.value;
            setSelected(v);
            const found = options.find((o) => o.packTypeId === v);
            setSelectedName(found?.name || "");
            // Clear previous open results to avoid mismatched image maps
            setCards(null);
            setRevealIndex(-1);
            setError(null);
          }}
        >
          {options?.map((o) => (
            <option key={o.packTypeId} value={o.packTypeId}>
              {o.name}
            </option>
          ))}
        </select>

        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-60"
          onClick={openNow}
          disabled={!selected || busy || !openable}
          title={openable ? "Open pack" : `Need ${Math.max(0, threshold - energy)} more energy`}
        >
          {busy ? "Opening…" : `Open ${selectedName || "pack"}`}
        </button>

        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      {cards && (
        <div className="pl-home-grid">
          {cards.map((c, i) => {
            const shown = revealIndex >= i;
            let img = getImgForList(selectedName, c.name); if (!img) img = getAnyImg(c.name);
            return (
              <div key={c.itemId || i} className={`pl-card ${rarityClass(c.rarity)}`}>
                <div className={`pl-face pl-back ${shown ? "pl-hidden" : ""}`}>
                  <span className="pl-star">★</span>
                </div>
                <div className={`pl-face pl-front ${shown ? "pl-show" : ""}`}>
                  <div className="flex justify-center mb-2">
                    {img ? (
                      <PixelArtImage src={img.src} alt={img.alt} size={96} />
                    ) : (
                      <div className="w-24 h-24 rounded-xl border grid place-items-center">🖼️</div>
                    )}
                  </div>
                  <div className="pl-title">{c.name}</div>
                  <div className="pl-rarity">{c.rarity}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
