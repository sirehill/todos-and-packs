'use client';
import { useEffect, useState } from 'react';
import { getEnergy } from '@/lib/energy';

export default function EnergyBar() {
  const [value, setValue] = useState(0);
  const [threshold, setThreshold] = useState(50);

  useEffect(() => {
    const e = getEnergy();
    setValue(e.value);
    setThreshold(e.threshold);
    const i = setInterval(() => {
      const n = getEnergy();
      if (n.value !== value) setValue(n.value);
    }, 300);
    return () => clearInterval(i);
  }, [value]);

  const pct = Math.min(100, Math.round((value / threshold) * 100));

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">⚡ Energy: {value} / {threshold}</div>
      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-2 rounded-full bg-blue-600 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
