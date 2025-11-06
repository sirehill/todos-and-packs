"use client";

import React from "react";
import { getImgForList } from "@/data/imageLookup";

type Item = {
  id: string;
  name: string;
  rarity?: string | null;
  qty: number;
};

export default function CollectionGrid({ listName, items }: { listName: string; items: Item[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {items.map((it) => {
        const img = getImgForList(listName, it.name) as any;
        const owned = (it.qty ?? 0) > 0;
        return (
          <div key={it.id} className="rounded-2xl p-3 shadow-md bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
            <div className="w-full flex items-center justify-center">
              {owned && img?.src ? (
                <img
                  src={img.src}
                  alt={img.alt ?? it.name}
                  width={128}
                  height={128}
                  style={{ imageRendering: "pixelated" }}
                  className="select-none"
                />
              ) : (
                <div
                  className="grid place-items-center select-none"
                  style={{
                    width: 128,
                    height: 128,
                    imageRendering: "pixelated",
                    background:
                      "linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.04) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.04) 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    borderRadius: 12,
                    border: "1px dashed rgba(0,0,0,0.15)"
                  }}
                >
                  <span className="text-4xl font-extrabold text-zinc-400">?</span>
                </div>
              )}
            </div>

            <div className="mt-3 w-full flex items-center justify-between">
              <div className="text-sm font-medium truncate">{it.name}</div>
              <div
                className={[
                  "text-xs px-2 py-0.5 rounded-full",
                  owned ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                       : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-300"
                ].join(" ")}
                title={owned ? `${it.qty} owned` : "Not discovered yet"}
              >
                {owned ? `×${it.qty}` : "×0"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
