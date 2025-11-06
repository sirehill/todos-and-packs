'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getEnergy, setEnergy } from "@/lib/energy";

export default function RemoveDuplicatesButton({ disabled }: { disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [award, setAward] = useState<number | null>(null);
  const router = useRouter();

  const onClick = async () => {
    if (busy || disabled) return;
    setBusy(true);
    try {
      const res = await fetch("/api/remove-duplicates", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed");
      const gained = Number(data?.awarded || 0);
      setAward(gained);
      // Add to local energy store
      if (gained > 0) {
        const cur = getEnergy();
        setEnergy({ ...cur, value: cur.value + gained });
      }
      // Refresh server components (duplicate count, etc.)
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to remove duplicates.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        disabled={disabled || busy}
        className={`rounded-md ${disabled ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2`}
      >
        {busy ? "Removing..." : "Remove duplicates"}
      </button>
      {award !== null && (
        <div className="text-sm text-green-700">You got {award} energy</div>
      )}
    </div>
  );
}
