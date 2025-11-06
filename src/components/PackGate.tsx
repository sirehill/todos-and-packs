'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getEnergy, canOpenPack, consumeForPack } from '@/lib/energy';

const HomePackOpener = dynamic(() => import('@/app/home-pack-opener'), { ssr: false });

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
    }, 300);
    return () => clearInterval(id);
  }, []);

  const onOpenPack = () => {
    if (!canOpenPack()) return;
    if (consumeForPack()) setShow(true);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPack}
          disabled={!openable}
          className={`rounded-md px-4 py-2 text-white ${openable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          title={!openable ? `Earn ${Math.max(0, threshold - energy)} more energy to open a pack` : 'Open a pack'}
        >
          Open Pack (uses energy)
        </button>
        <div className="text-sm text-slate-600">
          Energy: {energy} / {threshold}
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-4 w-full max-w-3xl relative">
            <button className="absolute right-3 top-3 opacity-60 hover:opacity-100" onClick={() => setShow(false)}>
              ✕
            </button>
            <HomePackOpener />
          </div>
        </div>
      )}
    </>
  );
}
