'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getEnergy, canOpenPack, consumeForPack } from '@/lib/energy';

const HomePackOpener = dynamic(() => import('@/app/home-pack-opener'), { ssr: false });

type Opt = { id: string; name: string; packTypeId: string };

// Provide at least one default option so the opener has something to select.
// You can replace this later with real options from your data source.
const DEFAULT_OPTIONS: Opt[] = [
  { id: 'default-animals', name: 'Animals', packTypeId: 'animals' }
];

export default function PackGate() {
  const [openable, setOpenable] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [threshold, setThreshold] = useState(50);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const e = getEnergy();
      setEnergy(e.value);
      setThreshold(e.threshold);
      setOpenable(canOpenPack());
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-60"
          onClick={() => setShow(true)}
          disabled={!openable}
          title={openable ? 'Open pack modal' : `Need ${Math.max(0, threshold - energy)} more energy`}
        >
          Open a Pack
        </button>
        {!openable && (
          <span className="text-xs text-zinc-600">
            Need {Math.max(0, threshold - energy)} more energy
          </span>
        )}
      </div>

      {show && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-4 w-full max-w-3xl relative">
            <button
              className="absolute right-3 top-3 opacity-60 hover:opacity-100"
              onClick={() => setShow(false)}
            >
              ✕
            </button>
            {/* Pass default options so HomePackOpener has valid props */}
            <HomePackOpener options={DEFAULT_OPTIONS} />
          </div>
        </div>
      )}
    </>
  );
}
